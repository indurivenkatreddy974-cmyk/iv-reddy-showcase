"use client";
import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
}

type Props = {
  url: string;
  width?: number;
  onPages?: (n: number) => void;
  onError?: () => void;
};

export default function PdfThumbnail({ url, width = 480, onPages, onError }: Props) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(false), [url]);

  return (
    <div className="w-full h-full flex items-center justify-center bg-white">
      <Document
        file={url}
        onLoadSuccess={(doc) => {
          onPages?.(doc.numPages);
          setReady(true);
        }}
        onLoadError={() => onError?.()}
        loading={<div className="w-full h-full bg-white/5" />}
        error={<div className="w-full h-full bg-white/5" />}
        noData={<div className="w-full h-full bg-white/5" />}
      >
        {ready && (
          <Page
            pageNumber={1}
            width={width}
            renderAnnotationLayer={false}
            renderTextLayer={false}
          />
        )}
      </Document>
    </div>
  );
}
