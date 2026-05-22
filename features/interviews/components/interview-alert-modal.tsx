import * as React from "react";
import { AlertTriangle, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export type AlertType = "confirmation" | "success" | "error";

interface InterviewAlertModalProps {
  isOpen: boolean;
  type: AlertType;
  mode?: "create" | "update" | "delete";
  isLoading?: boolean;
  onPrimaryAction: () => void;
  onSecondaryAction: () => void;
}

export function InterviewAlertModal({ isOpen, type, mode = "create", isLoading, onPrimaryAction, onSecondaryAction }: InterviewAlertModalProps) {
  if (!isOpen) return null;

  let confirmationDesc = "Are you sure to create the interview? Please double-check the information.";
  let confirmationPrimaryBtn = "Sure, Create Now";
  let successDesc = "Your interview has been created! View the Interview Details page to see more.";
  let errorDesc = "We were unable to create your interview. Please check your connection and try again.";
  let confirmationSecondaryBtn = "Go Back to Edit";
  let successPrimaryBtn = "Back to Home";
  let successSecondaryBtn = "View Interview Details";

  if (mode === "update") {
    confirmationDesc = "Are you sure to save the changes? Please double-check the information.";
    confirmationPrimaryBtn = "Sure, Save Now";
    successDesc = "Your interview has been updated! View the Interview Details page to see more.";
    errorDesc = "We were unable to update your interview. Please check your connection and try again.";
  } else if (mode === "delete") {
    confirmationDesc = "Are you sure to delete the session? Deleted session can not be restored.";
    confirmationPrimaryBtn = "Sure, Delete Now";
    successDesc = "Your interview session has been deleted.";
    errorDesc = "We were unable to delete your interview. Please check your connection and try again.";
    confirmationSecondaryBtn = "Cancel";
    successPrimaryBtn = "Okay";

  }

  const content: Record<AlertType, { icon: React.ReactNode; title: string; description: string; primaryBtn: string; secondaryBtn: string; primaryClass?: string; }> = {
    confirmation: {
      icon: (
        <Image
          src='/Confirm.svg'
          alt="Confirm"
          width={48}
          height={48}
          className="object-contain"
        />
      ),
      title: "Confirmation",
      description: confirmationDesc,
      primaryBtn: confirmationPrimaryBtn,
      secondaryBtn: confirmationSecondaryBtn,
      primaryClass:
        "bg-[#e0f7f9] text-[#0070c9] hover:bg-[#d0f0f2]",
    },
    success: {
      icon: (
        <Image
          src='/Success.svg'
          alt="Success"
          width={48}
          height={48}
          className="object-contain"
        />
      ),
      title: "Success!",
      description: successDesc,
      primaryBtn: successPrimaryBtn,
      secondaryBtn: successSecondaryBtn,
    },
    error: {
      icon: <XCircle className="w-12 h-12 text-red-500" />,
      title: "Oops!",
      description: errorDesc,
      primaryBtn: "Back to Home",
      secondaryBtn: "Try Again",
    }
  };

  const current = content[type];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"></div>

      {/* Modal */}
      <div className="relative w-full max-w-[472px] h-[316px] bg-white rounded-[12px] shadow-xl flex flex-col items-center p-8 text-center animate-in fade-in zoom-in-95 duration-200">
        <div className="mb-4">
          {current.icon}
        </div>

        <h3 className="text-[28px] font-bold text-slate-900 mb-2">
          {current.title}
        </h3>

        <p
          className={cn(
            "text-sm text-slate-500 mb-8",
            type === "confirmation" ? "max-w-[385px]" : "max-w-[380px]"
          )}
        >          {current.description}
        </p>

        <div
          className={cn(
            "w-[calc(100%+64px)] border-t border-slate-200 pt-6 px-8 mt-auto flex gap-[50px]",
            mode === "delete" && type === "success" && "justify-center"
          )}
        >
          <Button
            type="button"
            disabled={isLoading}
            onClick={onPrimaryAction}
            className={cn(
              mode === "delete" && type === "success"
                ? "w-[84px] h-[44px]"
                : type === "confirmation"
                  ? "w-[191px] h-[44px]"
                  : type === "success"
                    ? "max-w-[232px] h-[44px]"
                    : "flex-1 h-[44px]",
              "px-4 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2",
              mode === "delete" && type === "success"
                ? "bg-[#0070c9] text-white hover:bg-blue-700"
                : current.primaryClass || "bg-[#e0f7f9] text-[#0070c9] hover:bg-[#d0f0f2]"
            )}
          >
            {isLoading && type === "confirmation" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : null}

            {isLoading && type === "confirmation"
              ? "Wait..."
              : current.primaryBtn}
          </Button>

          {!(mode === "delete" && type === "success") && (
            <Button
              type="button"
              disabled={isLoading}
              onClick={onSecondaryAction}
              className={cn(
                type === "confirmation"
                  ? "w-[172px] h-[44px]"
                  : "flex-1 h-[44px]",
                "px-4 bg-[#0070c9] text-white hover:bg-blue-700 rounded-lg text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              )}
            >
              {isLoading && type === "error" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : null}

              {isLoading && type === "error"
                ? "Wait..."
                : current.secondaryBtn}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
