import { resultAnswerService } from "@/features/result-answer/service/result-answer-service";
import { getUserId } from "@/lib/auth";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { interviewService } from "../services/interview-service";
import { InterviewDetail } from "../types/interview";

type Phase = "break" | "answer";

export function useExamSession() {
  const params = useParams();
  const id = params?.interviewId as string;

  const [interviewDetail, setInterviewDetail] =
    useState<InterviewDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [breakTrigger, setBreakTrigger] = useState(0);
  const [phase, setPhase] = useState<Phase>("break");
  const [breakTime, setBreakTime] = useState(0);
  const [answerTime, setAnswerTime] = useState(0);
  const [answeredIds, setAnsweredIds] = useState<Set<string>>(new Set());
  const [audioLevel, setAudioLevel] = useState(0);
  const [candidateId, setCandidateId] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const candidateIdFetchedRef = useRef(false);

  const fetchDetail = async () => {
    if (!id) return;
    try {
      const detail = await interviewService.getInterviewById(id);
      setInterviewDetail(detail);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAnswered = async () => {
    const userId = getUserId();
    if (!userId || !id) return;
    try {
      const list = await interviewService.getAnsweredList(userId, id);
      setAnsweredIds(new Set(list.map((a: any) => a.questionId)));
    } catch (err) {
      console.error(err);
      setAnsweredIds(new Set());
    }
  };

  const fetchCandidateId = async () => {
    if (candidateIdFetchedRef.current) return;
    candidateIdFetchedRef.current = true;

    const userId = getUserId();
    if (!userId) return;

    try {
      const list = await resultAnswerService.getAnsweredList(userId, null);
      const foundCandidateId = list?.[0]?.candidateId ?? null;
      setCandidateId(foundCandidateId);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (interviewDetail?.questions) {
      const first = interviewDetail.questions.find(
        (q) => !answeredIds.has(q.id),
      );
      if (first) {
        setActiveQuestionId(first.id);
        resetPhase();
      }
    }
  }, [answeredIds]);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        await fetchDetail();
        await fetchAnswered();
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  useEffect(() => {
    fetchCandidateId();
  }, []);

  const resetPhase = () => {
    clearTimer();
    setPhase("break");
    setAnswerTime(0);
    setBreakTrigger((prev) => prev + 1);
  };

  const clearTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    if (phase === "break") {
      setBreakTime(0);
      timerRef.current = setInterval(() => {
        setBreakTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearTimer();
  }, [phase, breakTrigger]);

  const startRecording = async () => {
    chunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      const audioCtx = new AudioContext();
      audioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const data = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b, 0) / data.length;
        setAudioLevel(avg / 128);
        animFrameRef.current = requestAnimationFrame(tick);
      };
      tick();

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.start();
    } catch (err) {
      console.error("Failed to start recording:", err);
    }
  };

  const abortControllerRef = useRef<AbortController | null>(null);

  const cancelSubmit = async () => {
    abortControllerRef.current?.abort();
    setIsSubmitting(false);

    setAnswerTime(0);
    clearTimer();
    await startRecording();

    timerRef.current = setInterval(() => {
      setAnswerTime((prev) => prev + 1);
    }, 1000);
  };

  const stopRecording = (): Promise<File> => {
    return new Promise((resolve) => {
      const recorder = mediaRecorderRef.current;
      if (!recorder) return;
      recorder.onstop = () => {
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        audioCtxRef.current?.close();
        setAudioLevel(0);

        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        const file = new File([blob], "answer.webm", { type: "video/webm" });
        streamRef.current?.getTracks().forEach((t) => t.stop());
        resolve(file);
      };
      recorder.stop();
    });
  };

  const handleStart = async () => {
    clearTimer();
    setPhase("answer");
    setAnswerTime(0);
    await startRecording();
    timerRef.current = setInterval(() => {
      setAnswerTime((prev) => prev + 1);
    }, 1000);
  };

  const submitAnswer = async () => {
    if (!activeQuestionId) return;
    clearTimer();
    setIsSubmitting(true);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const videoFile = await stopRecording();
      await interviewService.uploadAnswer(
        activeQuestionId,
        breakTime,
        answerTime,
        videoFile,
        abortController.signal,
      );
      await fetchAnswered();
    } catch (err: any) {
      if (
        err.name === "CanceledError" ||
        err.code === "ERR_CANCELED" ||
        abortController.signal.aborted
      ) {
        return;
      }
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    interviewDetail,
    isLoading,
    activeQuestionId,
    isSubmitting,
    phase,
    breakTime,
    answerTime,
    handleStart,
    submitAnswer,
    videoRef,
    cancelSubmit,
    answeredIds,
    audioLevel,
    candidateId,
  };
}
