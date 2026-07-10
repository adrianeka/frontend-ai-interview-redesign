"use client";

import { useState } from "react";
import {
  AnswerDetailItem,
  useResultAnswerDetail,
} from "../../hooks/use-result-detail";
import { AnalysisSummary } from "./analysis-summary";
import { CandidateSidebar } from "./candidate-sidebar";
import { QuestionCard } from "./question-card";

interface ValidateAnswerProps {
  interviewId: string;
  candidateId: string;
}

export function ValidateAnswer({
  interviewId,
  candidateId,
}: ValidateAnswerProps) {
  const {
    data,
    isLoading,
    error,
    interviewInfo,
    validateAnswer,
    updateTranscript,
    refetch,
  } = useResultAnswerDetail(interviewId, candidateId);

  const [validatingId, setValidatingId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [isDoneValidating, setIsDoneValidating] = useState(false);


  if (isLoading) {
    return (
      <div className="h-[400px] flex items-center justify-center text-slate-400 text-sm">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-slate-500 font-medium text-sm">
        Gagal memuat data jawaban kandidat. Silakan coba lagi nanti.
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20 text-slate-500 font-medium text-sm">
        Data jawaban kandidat tidak ditemukan.
      </div>
    );
  }

  const sortedAnswers = [...data.answers].sort(
    (a, b) => a.questionNumber - b.questionNumber,
  );
  const totalQuestions = sortedAnswers.length;
  const validatedCount = sortedAnswers.filter((a) => a.isValidated).length;
  const allValidated = totalQuestions > 0 && validatedCount === totalQuestions;
  const isCompleted = Boolean(data.recommendation && data.totalScore !== null);

  const avgTechnicalScore = data.avgTechnicalFundamentalScore;
  const avgProblemSolvingScore = data.avgProblemSolvingScore;
  const avgCommunicationScore = data.avgCommunicationScore;

  const handleValidate = async (answer: AnswerDetailItem) => {
    setValidatingId(answer.questionId);
    await validateAnswer(answer.participantId, answer.questionId);
    setValidatingId(null);
  };

  const handleSaveTranscript = async (
    answer: AnswerDetailItem,
    text: string,
  ) => {
    setSavingId(answer.questionId);
    await updateTranscript(answer.participantId, answer.questionId, text);
    setSavingId(null);
  };

  const handleDoneValidate = async () => {
    setIsDoneValidating(true);

    try {
      // Trigger satu kali refetch untuk memastikan data terbaru
      const result = await refetch();

      // Jika grading sudah selesai (mungkin data sudah ada), tampilkan hasil
      if (result?.recommendation && result?.totalScore !== null) {
        setIsDoneValidating(false);
        return;
      }

      // Grading sedang berjalan di background — tampilkan pesan sukses
      // Pengguna tidak perlu menunggu di halaman ini karena grading async
      // Halaman akan otomatis menampilkan hasil jika di-refresh nanti
    } catch (err) {
      // Jika gagal, lepaskan loading state agar user bisa coba lagi
      setIsDoneValidating(false);
    }
    // isDoneValidating sengaja tidak di-set false di sini agar tombol tetap
    // terkunci dan pesan "Processing AI Grading..." tetap tampil sebagai
    // konfirmasi visual bahwa data sudah terkirim.
  };
  return (
    <div className="min-h-[75vh] bg-[#F5F6F8] flex items-center justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full md:w-[90vw] lg:w-[80vw] xl:w-[70vw] items-stretch">
        <div className="col-span-1 sm:col-span-2 rounded-[1rem] border border-[#E2E4E6] bg-[#FAFAFA] p-4 sm:p-6">
          <AnalysisSummary
            recommendation={data?.recommendation ?? ""}
            totalScore={data?.totalScore ?? 0}
            summaryReason={data?.summaryReason ?? ""}
            technicalScore={avgTechnicalScore}
            problemSolvingScore={avgProblemSolvingScore}
            communicationScore={avgCommunicationScore}
          />

          <div className="flex items-center gap-3 mb-2">
            <span className="text-[12px] text-slate-400 shrink-0">
              Candidate&apos;s Answer(s)
            </span>
            <div className="h-px flex-1 bg-[#E2E4E6]" />
          </div>

          <div>
            {sortedAnswers.map((answer) => (
              <QuestionCard
                key={answer.questionId}
                answer={answer}
                onValidate={() => handleValidate(answer)}
                onSaveTranscript={(text) => handleSaveTranscript(answer, text)}
                isValidating={validatingId === answer.questionId}
                isSaving={savingId === answer.questionId}
              />
            ))}
          </div>
        </div>

        <div className="col-span-1 max-w-[350px]">
          <CandidateSidebar
            companyName={interviewInfo?.companyNamePartner}
            candidateName={data.name}
            roleTarget={interviewInfo?.roleTarget}
            isCompleted={isCompleted}
            sortedAnswers={sortedAnswers}
            validatedCount={validatedCount}
            totalQuestions={totalQuestions}
            allValidated={allValidated}
            isDoneValidating={isDoneValidating}
            onDoneValidate={handleDoneValidate}
          />
        </div>
      </div>
    </div>
  );
}
