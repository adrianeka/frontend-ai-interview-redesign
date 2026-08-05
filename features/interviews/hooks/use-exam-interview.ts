import { resultAnswerService } from "@/features/result-answer/service/result-answer-service";
import { getUserId } from "@/lib/auth";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { interviewService } from "../services/interview-service";
import { InterviewDetail } from "../types/interview";
import api from "@/lib/axios";

type Phase = "break" | "answer";

/*
edit start
by: Zahra Hilyatul J
date: 2026-06-29
description: Added localSubmittedIds state and recording constraints to improve answer submission feedback loop
*/
export function useExamSession() {
  const params = useParams();
  const id = params?.interviewId as string;

  const [interviewDetail, setInterviewDetail] =
    useState<InterviewDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /*
  edit start
  by: Zahra
  date: 2026-07-17
  description: Added uploadError and pendingVideoFile state to handle upload failure gracefully.
               When upload fails, the recorded file is retained so the candidate can retry
               without needing to re-record their answer.
  */
  const [uploadError, setUploadError] = useState<string | null>(null);
  const pendingVideoFileRef = useRef<File | null>(null);

  // Anti-Cheat States
  const [isPreparationPhase, setIsPreparationPhase] = useState(true);
  const [isWarningVisible, setIsWarningVisible] = useState(false);
  /*
  edit start
  by: Zahra Hilyatul J
  date: 2026-07-22
  description: Changed violationCountRef (non-reactive ref) to strikeCount (reactive state)
               so the overlay can display the correct "Peringatan X dari 3" count live.
               Added isTerminated state for auto-kick at strike 4.
  */
  const [strikeCount, setStrikeCount] = useState(0);
  const [isTerminated, setIsTerminated] = useState(false);
  /*
  edit end
  */
  /*
  edit end
  */

  const [breakTrigger, setBreakTrigger] = useState(0);
  const [phase, setPhase] = useState<Phase>("break");
  const [breakTime, setBreakTime] = useState(0);
  const [answerTime, setAnswerTime] = useState(0);
  const [answeredIds, setAnsweredIds] = useState<Set<string>>(new Set());
  const [localSubmittedIds, setLocalSubmittedIds] = useState<Set<string>>(new Set());
  const [audioLevel, setAudioLevel] = useState(0);
  const [candidateId, setCandidateId] = useState<string | null>(null);
  const [participantId, setParticipantId] = useState<string | null>(null);

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

  /*
  edit start
  by: Zahra Hilyatul J
  date: 2026-07-22
  description: After getting participantId from list endpoint directly, immediately check existing violations from backend.
               If total violations >= 4, restore isTerminated + isWarningVisible so candidates
               cannot re-enter the exam after being auto-kicked by navigating back.
  */
  const fetchCandidateId = async (force = false) => {
    if (candidateIdFetchedRef.current && !force) return;
    candidateIdFetchedRef.current = true;

    const userId = getUserId();
    if (!userId || !id) return;

    try {
      const list = await resultAnswerService.getAnsweredList(userId, null);
      // Filter by current interviewId to get the correct participant
      const foundCandidate = list?.find((a: any) => a.interviewId === id) ?? null;
      const cid = foundCandidate?.candidateId ?? null;
      const pid = foundCandidate?.participantId ?? null;

      setCandidateId(cid);
      setParticipantId(pid);

      // Check existing violations using the interview ID endpoint
      try {
        const violationsRes = await api.get(`/v1/participants/interviews/${id}/violations`);
        const existingViolations = violationsRes.data ?? [];
        if (existingViolations.length >= 4 || foundCandidate?.isAutoTerminated) {
            setStrikeCount(4);
            setIsTerminated(true);
            setIsWarningVisible(true);
            setIsPreparationPhase(false);
        } else if (existingViolations.length > 0) {
            setStrikeCount(existingViolations.length);
        }
      } catch {
        // Non-critical — ignore
      }
    } catch (err) {
      console.error(err);
    }
  };
  /*
  edit end
  */

  useEffect(() => {
    if (interviewDetail?.questions) {
      const first = interviewDetail.questions.find(
        (q) => !answeredIds.has(q.id) && !localSubmittedIds.has(q.id),
      );
      if (first) {
        setActiveQuestionId(first.id);
        resetPhase();
      } else if (interviewDetail.questions.length > 0) {
        // All answered
        setActiveQuestionId(null);
      }
    }
  }, [answeredIds, interviewDetail, localSubmittedIds]);

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
    setBreakTime(0); // Ensure break time resets when phase changes
    setAnswerTime(0);
    setBreakTrigger((prev) => prev + 1);
  };

  const clearTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    let localTimer: NodeJS.Timeout | null = null;

    if (phase === "break" && !isPreparationPhase && !isWarningVisible) {
      localTimer = setInterval(() => {
        setBreakTime((prev) => prev + 1);
      }, 1000);
      
      // Store in global ref so clearTimer() works
      timerRef.current = localTimer;
    }

    return () => {
      if (localTimer) clearInterval(localTimer);
    };
  }, [phase, breakTrigger, isPreparationPhase, isWarningVisible]);

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

      const recorder = new MediaRecorder(stream, { videoBitsPerSecond: 250000 });
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

    chunksRef.current = []; // Prevent old video chunks from merging with new ones

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

  /*
  edit start
  by: Zahra
  date: 2026-07-17
  description: Refactored submitAnswer to retain the recorded file on upload failure.
               Added retryUpload function so candidates can re-send without re-recording.
               Added doUpload helper to share upload logic between first attempt and retry.
  */
  const doUpload = async (questionId: string, videoFile: File, signal: AbortSignal) => {
    await interviewService.uploadAnswer(
      questionId,
      breakTime,
      answerTime,
      videoFile,
      signal,
    );

    // Upload succeeded — clear pending file and error
    pendingVideoFileRef.current = null;
    setUploadError(null);

    setLocalSubmittedIds((prev) => {
      const newSet = new Set(prev);
      newSet.add(questionId);
      return newSet;
    });

    await fetchAnswered();
    await fetchCandidateId(true);
  };

  const submitAnswer = async () => {
    if (!activeQuestionId) return;
    clearTimer();
    setIsSubmitting(true);
    setUploadError(null);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const videoFile = await stopRecording();
      // Retain the file so we can retry without re-recording
      pendingVideoFileRef.current = videoFile;

      await doUpload(activeQuestionId, videoFile, abortController.signal);
    } catch (err: any) {
      if (
        err.name === "CanceledError" ||
        err.code === "ERR_CANCELED" ||
        abortController.signal.aborted
      ) {
        return;
      }
      console.error(err);
      const errMsg = err?.response?.data?.message || err?.message || "Upload failed";
      setUploadError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const retryUpload = async () => {
    if (!activeQuestionId || !pendingVideoFileRef.current) return;
    setIsSubmitting(true);
    setUploadError(null);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      await doUpload(activeQuestionId, pendingVideoFileRef.current, abortController.signal);
    } catch (err: any) {
      if (
        err.name === "CanceledError" ||
        err.code === "ERR_CANCELED" ||
        abortController.signal.aborted
      ) {
        return;
      }
      console.error(err);
      const errMsg = err?.response?.data?.message || err?.message || "Upload failed";
      setUploadError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Anti-Cheat Logic ---
  /*
  edit start
  by: Zahra Hilyatul J
  date: 2026-07-22
  description: Refactored recordViolation to use reactive strikeCount state instead of ref.
               Added auto-kick logic: when strikeCount reaches 4, set isTerminated = true
               which triggers the terminated overlay (no return button) via AntiCheatWarningOverlay.
  */
  const recordViolation = async (violationType: string, details: string = "") => {
    if (!id) return;

    const newCount = strikeCount + 1;
    setStrikeCount(newCount);

    try {
      await api.post(`/v1/participants/interviews/${id}/violations`, {
        violationType,
        questionId: activeQuestionId,
        details,
      });
    } catch (err) {
      console.error("Failed to record violation", err);
    }

    if (newCount >= 4) {
      // Auto-kick: terminate the session
      setIsTerminated(true);
      setIsWarningVisible(true);
    } else {
      setIsWarningVisible(true);
    }
  };
  /*
  edit end
  */

  // Ref to hold latest state for anti-cheat listeners to avoid stale closures
  const antiCheatStateRef = useRef({ phase, answerTime });
  useEffect(() => {
    antiCheatStateRef.current = { phase, answerTime };
  }, [phase, answerTime]);

  useEffect(() => {
    if (isPreparationPhase) return;

    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleCopy = (e: ClipboardEvent) => e.preventDefault();
    const handlePaste = (e: ClipboardEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F12" || (e.ctrlKey && e.shiftKey && e.key === "I")) {
        e.preventDefault();
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && !isWarningVisible && !isTerminated) {
        const currentPhase = antiCheatStateRef.current.phase;
        const currentAnsTime = antiCheatStateRef.current.answerTime;
        const timeContext = currentPhase === "answer" ? `[${currentAnsTime}s]` : `[break]`;
        recordViolation("TAB_SWITCH", `${timeContext} User switched tab or minimized window`);
      }
    };

    const handleWindowBlur = () => {
      if (!isWarningVisible && !isTerminated) {
        const currentPhase = antiCheatStateRef.current.phase;
        const currentAnsTime = antiCheatStateRef.current.answerTime;
        const timeContext = currentPhase === "answer" ? `[${currentAnsTime}s]` : `[break]`;
        recordViolation("WINDOW_BLUR", `${timeContext} Browser window lost focus`);
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !isWarningVisible && !isTerminated) {
        const currentPhase = antiCheatStateRef.current.phase;
        const currentAnsTime = antiCheatStateRef.current.answerTime;
        const timeContext = currentPhase === "answer" ? `[${currentAnsTime}s]` : `[break]`;
        recordViolation("LEAVE_FULLSCREEN", `${timeContext} User exited fullscreen mode`);
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [isPreparationPhase, isWarningVisible, isTerminated, activeQuestionId, candidateId, strikeCount]);

  const startExamSequence = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
      setIsPreparationPhase(false);
    } catch (err) {
      console.error("Fullscreen request failed", err);
      // Fallback
      setIsPreparationPhase(false);
    }
  };

  const acknowledgeWarning = async () => {
    try {
      if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
      setIsWarningVisible(false);
    } catch (err) {
      console.error("Fullscreen request failed", err);
      setIsWarningVisible(false);
    }
  };
  /*
  edit end
  */

  return {
    interviewDetail,
    isLoading,
    activeQuestionId,
    isSubmitting,
    uploadError,
    retryUpload,
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
    isPreparationPhase,
    isWarningVisible,
    strikeCount,
    isTerminated,
    startExamSequence,
    acknowledgeWarning,
  };
}
/*
edit end
*/
