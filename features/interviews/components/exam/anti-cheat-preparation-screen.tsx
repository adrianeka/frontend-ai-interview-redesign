import { useState } from "react";
import { Lock, Maximize, MonitorPlay, CopyX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface AntiCheatPreparationScreenProps {
  onStart: () => void;
  onCancel: () => void;
}

/*
edit start
by: Zahra Hilyatul J
date: 2026-07-22
description: Added consent checkbox per BRD requirement.
             Candidate must explicitly agree before starting the exam.
             'Mulai Ujian' button is disabled until checkbox is checked.
*/
export function AntiCheatPreparationScreen({ onStart, onCancel }: AntiCheatPreparationScreenProps) {
  const [isConsented, setIsConsented] = useState(false);
  return (
    <Dialog open={true}>
      <DialogContent 
        showCloseButton={false}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="sm:max-w-2xl p-8"
      >
        <DialogTitle className="sr-only">Persiapan Integritas Ujian</DialogTitle>
        <DialogDescription className="sr-only">Instruksi sebelum memulai ujian</DialogDescription>
        
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          
          <h2 className="text-2xl font-bold text-foreground mb-2">Persiapan Integritas Ujian</h2>
          <p className="text-muted-foreground text-center mb-8 max-w-md">
            Sebelum memulai ujian, pastikan Anda memahami ketentuan berikut. Pelanggaran dapat <strong className="text-foreground">membatalkan hasil ujian</strong> Anda.
          </p>

          <div className="w-full space-y-4 mb-8">
            <div className="flex items-start p-4 border border-border rounded-lg bg-muted/50">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-4 shrink-0">
                <Maximize className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Jangan keluar dari mode fullscreen</h3>
                <p className="text-sm text-muted-foreground">Keluar dari fullscreen akan dianggap sebagai pelanggaran ujian.</p>
              </div>
            </div>

            <div className="flex items-start p-4 border border-border rounded-lg bg-muted/50">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-4 shrink-0">
                <MonitorPlay className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Jangan buka tab atau aplikasi lain</h3>
                <p className="text-sm text-muted-foreground">Berpindah jendela atau tab akan tercatat sebagai kecurangan.</p>
              </div>
            </div>

            <div className="flex items-start p-4 border border-border rounded-lg bg-muted/50">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-4 shrink-0">
                <CopyX className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Copy soal dinonaktifkan</h3>
                <p className="text-sm text-muted-foreground">Teks soal tidak dapat disalin untuk menjaga integritas ujian. Jawaban hanya melalui speech-to-text.</p>
              </div>
            </div>
          </div>

          {/* Consent Checkbox */}
          <div
            className="w-full flex items-start gap-3 p-4 mb-2 border border-orange-200 bg-orange-50 rounded-lg cursor-pointer"
            onClick={() => setIsConsented((prev) => !prev)}
          >
            <input
              id="consent-checkbox"
              type="checkbox"
              checked={isConsented}
              onChange={(e) => setIsConsented(e.target.checked)}
              onClick={(e) => e.stopPropagation()}
              className="mt-0.5 shrink-0 w-4 h-4 accent-orange-600 cursor-pointer"
            />
            <label htmlFor="consent-checkbox" className="text-sm text-orange-800 leading-snug cursor-pointer select-none">
              Saya memahami bahwa sistem ini memonitor aktivitas perpindahan layar/tab.
              Jika saya terdeteksi melakukan tindakan indisipliner lebih dari 3 kali,
              sesi wawancara akan langsung ditutup otomatis dan saya dinyatakan{" "}
              <strong>GUGUR</strong>.
            </label>
          </div>

          <div className="w-full space-y-3">
            <Button
              onClick={onStart}
              disabled={!isConsented}
              className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ▶ Mulai Ujian
            </Button>
            <Button onClick={onCancel} variant="ghost" className="w-full text-muted-foreground hover:text-foreground">
              Kembali ke Dashboard
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
/*
edit end
*/
