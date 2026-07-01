"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConfirmValidateModalProps {
  open: boolean;
  questionNumber: number;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

export function ConfirmValidateModal({
  open,
  questionNumber,
  onConfirm,
  onCancel,
  isLoading,
}: ConfirmValidateModalProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent className="max-w-sm rounded-[1rem]">
        <DialogHeader>
          <DialogTitle className="text-slate-800">
            Validate Question {questionNumber}?
          </DialogTitle>
          <DialogDescription className="text-slate-500 text-sm">
            Once validated, this answer cannot be edited. Please ensure the
            transcript is correct before continuing.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 mt-2">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-[0.625rem] px-5 border-[#E2E4E6] text-slate-500 hover:text-slate-700"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-[#0076D2] hover:bg-[#005FA3] text-white rounded-[0.625rem] px-5"
          >
            {isLoading ? "Validating..." : "Yes, Validate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
