import { AlertTriangle, XCircle, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

/*
edit start
by: Zahra Hilyatul J
date: 2026-07-22
description: Refactored to support dynamic strike count messaging and terminated state.
             Single component reused for 3 states: warning (1-2), critical (3), and terminated (4).
             - strikeCount: current number of violations (reactive)
             - isTerminated: if true, renders the final "Sesi Dihentikan" screen without a return button
*/
interface AntiCheatWarningOverlayProps {
  onAcknowledge: () => void;
  strikeCount?: number;
  maxStrikes?: number;
  isTerminated?: boolean;
}

export function AntiCheatWarningOverlay({
  onAcknowledge,
  strikeCount = 1,
  maxStrikes = 3,
  isTerminated = false,
}: AntiCheatWarningOverlayProps) {
  const isCritical = strikeCount >= maxStrikes;

  // --- Terminated State ---
  if (isTerminated) {
    return (
      <Dialog open={true}>
        <DialogContent
          showCloseButton={false}
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          className="sm:max-w-md p-0 overflow-hidden border-destructive"
        >
          <DialogTitle className="sr-only">Sesi Ujian Dihentikan</DialogTitle>
          <DialogDescription className="sr-only">Sesi ujian Anda telah dihentikan secara otomatis.</DialogDescription>

          {/* Dark red top bar */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-red-800" />

          <div className="p-8 flex flex-col items-center w-full mt-2">
            <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mb-6">
              <XCircle className="w-8 h-8 text-red-800" />
            </div>

            <h2 className="text-xl font-bold text-foreground mb-2 text-center">
              Sesi Ujian Dihentikan
            </h2>

            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 mb-4">
              <p className="text-sm font-bold text-red-800 text-center">
                DISQUALIFIED — INTEGRITY BREACH
              </p>
            </div>

            <p className="text-muted-foreground text-center mb-4 text-sm">
              Anda telah mencapai batas maksimum pelanggaran ({maxStrikes}x). Sesi wawancara
              dihentikan secara otomatis dan Anda dinyatakan <strong className="text-red-700">GUGUR</strong>.
            </p>
            <p className="text-xs text-muted-foreground/70 text-center mb-8">
              Rekaman video sesi ini tetap disimpan sebagai barang bukti. Silakan hubungi HR jika ada pertanyaan.
            </p>

            <Button
              onClick={() => window.location.href = "/interviews"}
              variant="outline"
              className="w-full h-11 text-sm font-semibold border-red-300 text-red-800 hover:bg-red-50"
            >
              Kembali ke Dashboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // --- Warning / Critical State ---
  return (
    <Dialog open={true}>
      <DialogContent
        showCloseButton={false}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="sm:max-w-md p-0 overflow-hidden border-border"
      >
        <DialogTitle className="sr-only">Peringatan Pelanggaran</DialogTitle>
        <DialogDescription className="sr-only">Anda telah melakukan pelanggaran ujian.</DialogDescription>

        {/* Top bar — oranye untuk warning, merah untuk critical */}
        <div className={`absolute top-0 left-0 right-0 h-2 ${isCritical ? "bg-red-600" : "bg-orange-500"}`} />

        <div className="p-8 flex flex-col items-center w-full mt-2">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${isCritical ? "bg-red-100" : "bg-orange-100"}`}>
            {isCritical
              ? <ShieldAlert className="w-8 h-8 text-red-600" />
              : <AlertTriangle className="w-8 h-8 text-orange-500" />
            }
          </div>

          {/* Strike counter badge */}
          <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase mb-4 ${isCritical ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"}`}>
            Pelanggaran {strikeCount} dari {maxStrikes}
          </div>

          <h2 className="text-xl font-bold text-foreground mb-4 text-center">
            {isCritical
              ? "⚠ Peringatan Kritis — Terakhir!"
              : "Peringatan: Pelanggaran Terdeteksi"
            }
          </h2>

          <p className="text-muted-foreground text-center mb-2 text-sm">
            Anda terdeteksi meninggalkan tab atau keluar dari mode fullscreen.
            Tindakan ini telah dicatat oleh sistem.
          </p>

          {isCritical ? (
            <p className="text-sm font-semibold text-red-600 text-center mb-8">
              Ini adalah peringatan terakhir Anda. Satu pelanggaran lagi akan mengakibatkan
              sesi ujian dihentikan secara permanen.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground text-center mb-8">
              Pada pelanggaran ke-{maxStrikes + 1}, sesi ujian akan dihentikan otomatis dan Anda dinyatakan gugur.
            </p>
          )}

          <Button
            onClick={onAcknowledge}
            className={`w-full h-12 text-base font-semibold text-white mb-4 ${isCritical ? "bg-red-600 hover:bg-red-700" : "bg-orange-500 hover:bg-orange-600"}`}
          >
            ▶ Kembali ke Interview
          </Button>

          <p className="text-xs text-muted-foreground/70 text-center">
            Tekan tombol di atas untuk melanjutkan interview Anda.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
/*
edit end
*/
