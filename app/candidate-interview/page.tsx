import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  ChevronLeft, 
  Building2, 
  Info, 
  CheckCircle2, 
  Clock, 
  Quote,
  Maximize,
  Volume2,
  Settings,
  Play
} from "lucide-react";

// Mock data for the questions based on your Figma design
const questionsData = [
  { id: 1, status: "Validated" },
  { id: 2, status: "Validated" },
  { id: 3, status: "Validated" },
  { id: 4, status: "Pending" },
  { id: 5, status: "Pending" },
];

export default function CandidateInterviewPage() {
  return (
    <main className="min-h-screen bg-[#F5F5F5] py-4 px-4 md:px-10 lg:px-[176px] flex justify-center">
      <Card className="w-full max-w-[1200px] flex flex-col gap-6 bg-[#FAFAFA] rounded-2xl shadow-sm border border-black/5 p-6 md:p-8">
        
        {/* Top Action Bar */}
        <div className="flex items-center">
          <Button variant="ghost" className="text-[#707784] font-medium text-base gap-2 px-2 hover:bg-gray-100">
            <ChevronLeft className="w-5 h-5 text-[#707784]" />
            Back
          </Button>
        </div>

        {/* Candidate Profile Header */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <img 
              src="https://placehold.co/48x48" 
              alt="Profile" 
              className="w-12 h-12 rounded-full border-2 border-[#E2E4E6] object-cover"
            />
            <div className="flex flex-col gap-1 flex-1">
              <h1 className="text-[22px] font-bold text-[#2D2F35] leading-snug">
                Adrian Eka Saputra
              </h1>
              <div className="flex flex-wrap items-center gap-1.5 text-base">
                <span className="text-[#A9ADB5] font-medium">Interview Role</span>
                <span className="text-[#8C929D]">:</span>
                <span className="text-[#43474F] font-medium">
                  Development Support Engineer (KSEI Core & Surrounding Systems)
                </span>
              </div>
            </div>
            {/* Company Badge */}
            <div className="flex items-center gap-2 px-2 py-1 bg-[#F5F5F5] border border-[#E2E4E6] rounded-md h-fit">
              <Building2 className="w-4 h-4 text-[#3366FF]" />
              <span className="text-[#43474F] text-sm font-medium">OCBC Bank</span>
            </div>
          </div>

          {/* Progress Stepper */}
          <div className="flex flex-col md:flex-row items-center md:items-start justify-center w-full gap-6 py-6 mt-2">
            
            {/* Step 1 */}
            <div className="relative flex flex-col items-center w-[134px]">
              {/* Line 1 -> 2 (Completed line - BLUE) */}
              <div className="hidden md:block absolute top-[13px] left-[50%] w-[calc(100%+1.5rem)] h-[2px] bg-[#0076D2] z-0" />
              
              <div className="relative z-10 w-7 h-7 shrink-0 bg-[#0076D2] text-[#FAFAFA] font-bold rounded-full flex items-center justify-center text-sm">1</div>
              <span className="text-center text-[#595F6A] text-sm font-medium leading-tight mt-2">
                Transcription and Answer Integration
              </span>
            </div>
            
            {/* Step 2 */}
            <div className="relative flex flex-col items-center w-[134px]">
              {/* Line 2 -> 3 (Pending line - GREY) */}
              <div className="hidden md:block absolute top-[14px] left-[50%] w-[calc(100%+1.5rem)] h-[1px] bg-[#E2E4E6] z-0" />
              
              <div className="relative z-10 w-7 h-7 shrink-0 bg-[#FAFAFA] border-2 border-[#0076D2] text-[#43474F] font-bold rounded-full flex items-center justify-center text-sm">2</div>
              <span className="text-center text-[#595F6A] text-sm font-medium leading-tight mt-2">
                Candidate Validation
              </span>
            </div>
            
            {/* Step 3 */}
            <div className="relative flex flex-col items-center w-[134px]">
              {/* Line 3 -> 4 (Pending line - GREY) */}
              <div className="hidden md:block absolute top-[14px] left-[50%] w-[calc(100%+1.5rem)] h-[1px] bg-[#E2E4E6] z-0" />
              
              <div className="relative z-10 w-7 h-7 shrink-0 bg-[#E2E4E6] text-[#43474F] font-bold rounded-full flex items-center justify-center text-sm">3</div>
              <span className="text-center text-[#595F6A] text-sm font-medium leading-tight mt-2">
                Grading Answer by AI
              </span>
            </div>
            
            {/* Step 4 (No line after this) */}
            <div className="relative flex flex-col items-center w-[134px]">
              <div className="relative z-10 w-7 h-7 shrink-0 bg-[#E2E4E6] text-[#43474F] font-bold rounded-full flex items-center justify-center text-sm">4</div>
              <span className="text-center text-[#595F6A] text-sm font-medium leading-tight mt-2">
                Result
              </span>
            </div>
            
          </div>

          {/* Validation Alert Banner */}
          <div className="flex flex-col gap-1.5 p-5 bg-[#F1F9FA] rounded-lg border-l-4 border-[#0076D2]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-[#0076D2]" />
                <span className="text-[#43474F] font-bold text-base">Candidate is validating the interview data</span>
              </div>
              <div className="bg-[#0076D2] text-[#FAFAFA] text-xs font-semibold px-2 py-1 rounded-full">
                3/5 Validated
              </div>
            </div>
            <p className="text-[#707784] text-sm ml-7">
              The candidate is reviewing their answers. Please wait to see the validated data.
            </p>
          </div>
        </div>

        {/* Score Breakdown Section */}
        <div className="flex flex-col gap-4 mt-2">
          <div className="flex items-center gap-6">
            <h2 className="text-[#A9ADB5] text-sm font-medium whitespace-nowrap">Candidate's Score Breakdown</h2>
            <div className="h-[1px] bg-[#E2E4E6] w-full" />
          </div>
          
          <div className="flex items-center mb-2">
            <span className="text-[#43474F] font-medium text-base w-48">Final Score</span>
            <span className="text-[#8C929D] font-medium text-base">No data yet</span>
          </div>
          
          <div className="flex flex-col gap-4 pl-6 border-l-4 border-[#E2E4E6] py-2">
            <div className="flex items-center">
              <div className="w-48 text-base">
                <span className="text-[#43474F] font-medium">Technical Skill </span>
                <span className="text-[#A9ADB5]">(50%)</span>
              </div>
              <span className="text-[#8C929D] font-medium text-base">No data yet</span>
            </div>
            <div className="flex items-center">
              <div className="w-48 text-base">
                <span className="text-[#43474F] font-medium">Problem Solving </span>
                <span className="text-[#A9ADB5]">(30%)</span>
              </div>
              <span className="text-[#8C929D] font-medium text-base">No data yet</span>
            </div>
            <div className="flex items-center">
              <div className="w-48 text-base">
                <span className="text-[#43474F] font-medium">Communication </span>
                <span className="text-[#A9ADB5]">(20%)</span>
              </div>
              <span className="text-[#8C929D] font-medium text-base">No data yet</span>
            </div>
          </div>
        </div>

        {/* Candidate's Answers Section */}
        <div className="flex flex-col gap-4 mt-4">
          <div className="flex items-center gap-6">
            <h2 className="text-[#A9ADB5] text-sm font-medium whitespace-nowrap">Candidate's Answer(s)</h2>
            <div className="h-[1px] bg-[#E2E4E6] w-full" />
          </div>

          <div className="flex flex-col gap-8 py-4">
            {questionsData.map((q, index) => (
              <React.Fragment key={q.id}>
                <div className="flex flex-col lg:flex-row gap-6 px-3">
                  
                  {/* Video Player Placeholder */}
                  <div 
                    className="w-full lg:w-[501px] h-[320px] rounded-lg relative overflow-hidden flex flex-col justify-end p-6 shrink-0 bg-gray-200"
                    style={{ backgroundImage: 'url(https://placehold.co/501x320)', backgroundSize: 'cover' }}
                  >
                    {/* Gradient Overlay bottom */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
                    
                    {/* Controls */}
                    <div className="relative z-10 flex flex-col gap-3 w-full">
                      <div className="flex justify-between items-center text-[#FAFAFA]">
                        <div className="flex items-center gap-2 text-sm">
                          <Play className="w-4 h-4 fill-white" />
                          <span>1:22 / 2:54</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Settings className="w-4 h-4" />
                          <Volume2 className="w-4 h-4" />
                          <Maximize className="w-4 h-4" />
                        </div>
                      </div>
                      {/* Progress Bar */}
                      <div className="w-full h-2 bg-[#A9ADB5] rounded-full overflow-hidden">
                        <div className="h-full bg-[#FAFAFA] w-1/2 rounded-full" />
                      </div>
                    </div>
                  </div>

                  {/* Question & Answer Details */}
                  <div className="flex flex-col gap-6 flex-1">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-[#43474F] font-bold text-base">Question {q.id}</h3>
                        
                        {/* Status Badge */}
                        {q.status === "Validated" ? (
                          <div className="bg-[#EEF8F4] border border-[#C9EBDE] px-2 py-0.5 rounded-full flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#52BD94]" />
                            <span className="text-[#4BAC87] text-xs font-medium">Validated</span>
                          </div>
                        ) : (
                          <div className="bg-[#FAFAFA] border border-[#E2E4E6] px-2 py-0.5 rounded-full flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#595F6A]" />
                            <span className="text-[#595F6A] text-xs font-medium">Pending</span>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-[#8C929D] font-medium text-sm">
                        Can you describe your experience with debugging complex software issues?
                      </p>
                      
                      <div className="bg-[#F1F9FA] border-l-2 border-[#0076D2] p-3 flex items-start gap-3 mt-1 rounded-r border-r border-y border-[#E2E4E6]/50">
                        <Quote className="w-4 h-4 text-[#0076D2] shrink-0 mt-0.5" />
                        <p className="text-[#43474F] text-sm leading-relaxed">
                          I am expertise in cloud architecture, showcasing proficiency in AWS, Azure, and GCP, along with a strong understanding of serverless computing and containerization.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <h4 className="text-[#8C929D] font-semibold text-sm">Overall Score</h4>
                      <p className="text-[#8C929D] text-sm">
                        The score will be available after AI grading is complete.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Divider between items except the last one */}
                {index < questionsData.length - 1 && (
                  <div className="h-[1px] bg-[#E2E4E6] w-full" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </Card>
    </main>
  );
}