"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ZoomOut, Download, Maximize2, ExternalLink, FileText } from "lucide-react";

export type PdfPreviewModalProps = {
  open: boolean;
  url: string;
  title?: string;
  onClose: () => void;
};

export function PdfPreviewModal({ open, url, title, onClose }: PdfPreviewModalProps) {
  const [zoom, setZoom] = useState(100);
  const wrapRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open) setZoom(100);
  }, [open, url]);

  const src = url ? `${url}#zoom=${zoom}&toolbar=0&navpanes=0` : "";

  const download = async () => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const a = document.createElement("a");
      const objUrl = URL.createObjectURL(blob);
      a.href = objUrl;
      a.download = (title ? title.replace(/[^\w\-]+/g, "_") : "document") + ".pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(objUrl), 1000);
    } catch {
      window.open(url, "_blank");
    }
  };

  const fullscreen = () => {
    const el = wrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(24px)" }}
            onClick={onClose}
          />
          <motion.div
            ref={wrapRef}
            initial={{ scale: 0.96, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-5xl h-[92vh] rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col"
            style={{
              background: "linear-gradient(160deg, rgba(20,22,38,0.95), rgba(12,12,12,0.95))",
              border: "1px solid rgba(74,158,255,0.3)",
              boxShadow: "0 30px 80px -20px rgba(74,158,255,0.4)",
            }}
          >
            {/* Toolbar */}
            <div
              className="flex items-center gap-2 px-3 sm:px-5 py-3 border-b"
              style={{ borderColor: "rgba(215,226,234,0.1)" }}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <FileText className="w-4 h-4 text-[#4a9eff] shrink-0" />
                <div className="text-xs sm:text-sm font-medium text-[#D7E2EA] truncate">
                  {title ?? "Document"}
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-1 mr-2">
                <button
                  onClick={() => setZoom((z) => Math.max(50, z - 25))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#D7E2EA]/70 hover:text-white hover:bg-white/10"
                  aria-label="Zoom out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <div className="text-[10px] uppercase tracking-widest text-[#D7E2EA]/60 w-12 text-center">
                  {zoom}%
                </div>
                <button
                  onClick={() => setZoom((z) => Math.min(250, z + 25))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#D7E2EA]/70 hover:text-white hover:bg-white/10"
                  aria-label="Zoom in"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={fullscreen}
                className="hidden sm:flex w-8 h-8 rounded-lg items-center justify-center text-[#D7E2EA]/70 hover:text-white hover:bg-white/10"
                aria-label="Fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="sm:hidden w-8 h-8 rounded-lg flex items-center justify-center text-[#D7E2EA]/70 hover:text-white hover:bg-white/10"
                aria-label="Open in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={download}
                className="flex items-center gap-1.5 text-[10px] sm:text-xs uppercase tracking-widest px-3 py-2 rounded-full text-white"
                style={{ background: "linear-gradient(135deg, #4a9eff, #7621B0)" }}
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Download</span>
              </button>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#D7E2EA]/70 hover:text-white hover:bg-white/10"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* PDF viewport */}
            <div className="flex-1 overflow-hidden bg-[#1a1a1a]">
              {url ? (
                <iframe
                  ref={iframeRef}
                  src={src}
                  title={title ?? "PDF preview"}
                  className="w-full h-full border-0"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#D7E2EA]/40 text-sm">
                  No document available
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
