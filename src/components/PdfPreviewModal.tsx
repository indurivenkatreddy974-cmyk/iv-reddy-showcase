"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  FileText,
  Loader2,
  Maximize2,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import {
  getDocumentFilename,
  getDocumentKind,
  normalizeUrl,
  triggerDocumentDownload,
} from "@/lib/document-utils";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

type PdfRuntime = typeof import("react-pdf");

export type PdfPreviewModalProps = {
  open: boolean;
  url: string;
  title?: string;
  onClose: () => void;
};

export function PdfPreviewModal({ open, url, title, onClose }: PdfPreviewModalProps) {
  const [pdfRuntime, setPdfRuntime] = useState<PdfRuntime | null>(null);
  const [zoom, setZoom] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [containerWidth, setContainerWidth] = useState(920);
  const [loadError, setLoadError] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const normalizedUrl = useMemo(() => normalizeUrl(url), [url]);
  const documentKind = useMemo(() => getDocumentKind(normalizedUrl), [normalizedUrl]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (documentKind === "pdf" && e.key === "ArrowRight") setPageNumber((p) => Math.min(numPages || 1, p + 1));
      if (documentKind === "pdf" && e.key === "ArrowLeft") setPageNumber((p) => Math.max(1, p - 1));
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose, documentKind, numPages]);

  useEffect(() => {
    if (!open) return;
    setZoom(1);
    setPageNumber(1);
    setNumPages(0);
    setLoadError(null);
  }, [open, normalizedUrl]);

  useEffect(() => {
    if (!open || !viewportRef.current || typeof ResizeObserver === "undefined") return;
    const update = () => {
      const width = viewportRef.current?.clientWidth ?? 920;
      setContainerWidth(Math.max(280, width - 40));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(viewportRef.current);
    return () => observer.disconnect();
  }, [open]);

  useEffect(() => {
    if (!open || documentKind !== "pdf" || pdfRuntime) return;

    let cancelled = false;
    void import("react-pdf")
      .then((mod) => {
        mod.pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.min.mjs",
          import.meta.url,
        ).toString();
        if (!cancelled) setPdfRuntime(mod);
      })
      .catch(() => {
        if (!cancelled) setLoadError("Document unavailable");
      });

    return () => {
      cancelled = true;
    };
  }, [open, documentKind, pdfRuntime]);

  const fullscreen = () => {
    const el = wrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.();
  };

  const handleDownload = () => {
    if (!triggerDocumentDownload(normalizedUrl, title)) {
      setLoadError("Document unavailable");
    }
  };

  const canPaginate = documentKind === "pdf" && numPages > 1;
  const pageWidth = Math.min(1200, Math.max(280, containerWidth * zoom));

  const renderBody = () => {
    if (!normalizedUrl) {
      return <FallbackState message="Document unavailable" />;
    }

    if (loadError) {
      return <FallbackState message={loadError} url={normalizedUrl} title={title} />;
    }

    if (documentKind === "image") {
      return (
        <div className="w-full h-full overflow-auto p-4 sm:p-6 flex items-start justify-center">
          <img
            src={normalizedUrl}
            alt={title ?? "Document preview"}
            className="max-w-full h-auto rounded-2xl"
            style={{ width: `${zoom * 100}%`, maxWidth: 1200 }}
            onError={() => setLoadError("Document unavailable")}
          />
        </div>
      );
    }

    if (documentKind === "pdf") {
      if (!pdfRuntime) {
        return <LoadingState label="Preparing document viewer" />;
      }

      const { Document, Page } = pdfRuntime;
      return (
        <div ref={viewportRef} className="w-full h-full overflow-auto p-2 sm:p-6">
          <div className="flex justify-center min-h-full">
            <Document
              file={normalizedUrl}
              loading={<LoadingState label="Opening document" />}
              error={<FallbackState message="Document unavailable" url={normalizedUrl} title={title} />}
              onLoadSuccess={(pdf) => {
                setNumPages(pdf.numPages);
                setPageNumber((current) => Math.min(Math.max(1, current), pdf.numPages));
                setLoadError(null);
              }}
              onLoadError={() => setLoadError("Document unavailable")}
              options={{ cMapUrl: "/cmaps/", standardFontDataUrl: "/standard_fonts/" }}
            >
              <Page
                pageNumber={pageNumber}
                width={pageWidth}
                renderTextLayer
                renderAnnotationLayer
                loading={<LoadingState label={`Loading page ${pageNumber}`} compact />}
              />
            </Document>
          </div>
        </div>
      );
    }

    return <FallbackState message="Preview not available for this file" url={normalizedUrl} title={title} />;
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
            className="relative w-full max-w-6xl h-[92vh] rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col"
            style={{
              background: "linear-gradient(160deg, rgba(20,22,38,0.95), rgba(12,12,12,0.95))",
              border: "1px solid rgba(74,158,255,0.3)",
              boxShadow: "0 30px 80px -20px rgba(74,158,255,0.4)",
            }}
          >
            <div
              className="flex flex-wrap items-center gap-2 px-3 sm:px-5 py-3 border-b"
              style={{ borderColor: "rgba(215,226,234,0.1)" }}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <FileText className="w-4 h-4 text-[#4a9eff] shrink-0" />
                <div className="text-xs sm:text-sm font-medium text-[#D7E2EA] truncate">
                  {title ?? getDocumentFilename(normalizedUrl, title)}
                </div>
              </div>

              <div className="flex items-center gap-1 order-3 sm:order-none w-full sm:w-auto justify-between sm:justify-start">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setZoom((z) => Math.max(0.75, Number((z - 0.25).toFixed(2))))}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#D7E2EA]/70 hover:text-white hover:bg-white/10"
                    aria-label="Zoom out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <div className="text-[10px] uppercase tracking-widest text-[#D7E2EA]/60 w-14 text-center">
                    {Math.round(zoom * 100)}%
                  </div>
                  <button
                    onClick={() => setZoom((z) => Math.min(2.5, Number((z + 0.25).toFixed(2))))}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#D7E2EA]/70 hover:text-white hover:bg-white/10"
                    aria-label="Zoom in"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>

                {documentKind === "pdf" && (
                  <div className="flex items-center gap-1 ml-2 sm:ml-3">
                    <button
                      onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                      disabled={pageNumber <= 1}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[#D7E2EA]/70 hover:text-white hover:bg-white/10 disabled:opacity-30"
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="text-[10px] uppercase tracking-widest text-[#D7E2EA]/60 min-w-[84px] text-center">
                      {numPages ? `${pageNumber} / ${numPages}` : "Page —"}
                    </div>
                    <button
                      onClick={() => setPageNumber((p) => Math.min(numPages || 1, p + 1))}
                      disabled={!canPaginate || pageNumber >= numPages}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[#D7E2EA]/70 hover:text-white hover:bg-white/10 disabled:opacity-30"
                      aria-label="Next page"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={fullscreen}
                className="hidden sm:flex w-8 h-8 rounded-lg items-center justify-center text-[#D7E2EA]/70 hover:text-white hover:bg-white/10"
                aria-label="Fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <a
                href={normalizedUrl || "#"}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#D7E2EA]/70 hover:text-white hover:bg-white/10"
                aria-label="Open in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 text-[10px] sm:text-xs uppercase tracking-widest px-3 py-2 rounded-full text-white"
                style={{ background: "linear-gradient(135deg, #4a9eff, #7621B0)" }}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#D7E2EA]/70 hover:text-white hover:bg-white/10"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-hidden bg-[#141414]">{renderBody()}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function LoadingState({ label, compact = false }: { label: string; compact?: boolean }) {
  return (
    <div className={`w-full flex items-center justify-center text-[#D7E2EA]/60 ${compact ? "py-12" : "h-full"}`}>
      <div className="flex items-center gap-3 text-sm">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>{label}</span>
      </div>
    </div>
  );
}

function FallbackState({ message, url, title }: { message: string; url?: string; title?: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center p-6">
      <div className="max-w-md rounded-3xl border border-[#D7E2EA]/10 bg-white/5 px-6 py-8 text-center">
        <AlertCircle className="w-8 h-8 mx-auto mb-3 text-[#4a9eff]" />
        <div className="text-sm text-[#D7E2EA]">{message}</div>
        <div className="text-xs text-[#D7E2EA]/50 mt-2">Try opening it in a new tab or downloading the file.</div>
        <div className="mt-4 flex items-center justify-center gap-2">
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-[11px] uppercase tracking-widest px-4 py-2 rounded-full text-white"
              style={{ background: "linear-gradient(135deg, #4a9eff, #7621B0)" }}
            >
              <ExternalLink className="w-3.5 h-3.5" /> Open
            </a>
          )}
          {url && (
            <button
              onClick={() => triggerDocumentDownload(url, title)}
              className="flex items-center gap-2 text-[11px] uppercase tracking-widest px-4 py-2 rounded-full border border-[#D7E2EA]/20 text-[#D7E2EA]/85"
            >
              <Download className="w-3.5 h-3.5" /> Download
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
