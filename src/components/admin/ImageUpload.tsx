"use client";

import { useRef, useState, useCallback } from "react";
import { createImageUploadAction, recordImageUploadAction, deleteImageAction } from "@/lib/admin-actions";

type Props = {
  initialUrl?: string | null;
  onUpload: (url: string) => void;
  onRemove?: () => void;
  label?: string;
  className?: string;
};

type State = "idle" | "uploading" | "preview" | "error";

export default function ImageUpload({
  initialUrl,
  onUpload,
  onRemove,
  label = "Product image",
  className = "",
}: Props) {
  const [state, setState] = useState<State>(initialUrl ? "preview" : "idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialUrl ?? null);
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isDragging = useRef(false);

  const reset = () => {
    setState("idle");
    setPreviewUrl(null);
    setProgress(0);
    setErrorMsg(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const uploadFile = useCallback(async (file: File) => {
    setErrorMsg(null);
    setProgress(0);
    setState("uploading");

    // Generate preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    try {
      // Get pre-signed URL from server
      const result = await createImageUploadAction(file.name, file.type, file.size);

      if ("error" in result) {
        setState("error");
        setErrorMsg(result.error);
        URL.revokeObjectURL(objectUrl);
        setPreviewUrl(null);
        return;
      }

      // Upload directly to Supabase Storage
      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          setProgress(Math.round((e.loaded / e.total) * 100));
        }
      });

      await new Promise<void>((resolve, reject) => {
        xhr.onload = async () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const recorded = await recordImageUploadAction(
              result.storagePath,
              file.name,
              file.type,
              file.size
            );
            if ("error" in recorded) {
              // The bytes reached storage but the managed ledger could not be
              // recorded. Remove the un-managed object so it can never orphan,
              // and fail honestly instead of reporting an untrackable success.
              try {
                await deleteImageAction(result.publicUrl);
              } catch {
                // best-effort cleanup; no reference will ever point at it
              }
              reject(
                new Error(
                  "The image was uploaded but could not be recorded. Please try again."
                )
              );
              return;
            }
            onUpload(result.publicUrl);
            setState("preview");
            resolve();
          } else {
            reject(new Error(`Upload failed: ${xhr.statusText}`));
          }
        };
        xhr.onerror = () => reject(new Error("Upload request failed"));
        xhr.onabort = () => reject(new Error("Upload cancelled"));
        xhr.open("PUT", result.uploadUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });
    } catch (err) {
      setState("error");
      setErrorMsg((err as Error).message);
      URL.revokeObjectURL(objectUrl);
      setPreviewUrl(null);
    }
  }, [onUpload]);

  const handleFile = (file: File | null) => {
    if (!file) return;
    uploadFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    isDragging.current = false;
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    isDragging.current = true;
  };

  const handleDragLeave = () => {
    isDragging.current = false;
  };

  if (state === "preview" && previewUrl) {
    return (
      <div className={`space-y-3 ${className}`}>
        {label && (
          <p className="font-mono text-[10px] uppercase tracking-[0.20em] text-[var(--ink-muted)]">
            {label}
          </p>
        )}
        <div className="relative overflow-hidden rounded border border-[var(--line-on-light)] bg-[var(--bone)]">
          <img
            src={previewUrl}
            alt="Uploaded image"
            className="h-48 w-full object-cover md:h-56"
          />
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="border border-[var(--line-on-light)] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink)] transition-colors hover:border-[var(--ink)]"
          >
            Replace
          </button>
          {onRemove && (
            <button
              type="button"
              onClick={() => {
                reset();
                onRemove();
              }}
              className="border border-red-200 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-red-600 transition-colors hover:border-red-600 hover:text-red-800"
            >
              Remove
            </button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className={`space-y-3 ${className}`}>
        {label && (
          <p className="font-mono text-[10px] uppercase tracking-[0.20em] text-[var(--ink-muted)]">
            {label}
          </p>
        )}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          className="relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded border-2 border-dashed border-red-300 bg-red-50 px-6 py-8 text-center transition-colors hover:border-red-500 hover:bg-red-100"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-red-600">
            Upload failed
          </p>
          <p className="font-mono text-[10px] text-red-500">
            {errorMsg ?? "An error occurred. Try again."}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--ink-faint)]">
            Click to retry
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <p className="font-mono text-[10px] uppercase tracking-[0.20em] text-[var(--ink-muted)]">
            {label}
          </p>
      )}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => state !== "uploading" && inputRef.current?.click()}
        className={`relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded border-2 border-dashed px-6 py-8 text-center transition-colors ${
          state === "uploading"
            ? "cursor-wait border-[var(--accent)] bg-[var(--champagne)]/10"
            : "border-[var(--line-on-light)] hover:border-[var(--ink)] hover:bg-[var(--bone)]"
        }`}
      >
        {state === "uploading" ? (
          <>
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Uploading preview"
                className="h-32 w-full object-cover opacity-60"
              />
            )}
            <div className="w-full max-w-[200px]">
              <div className="h-1 w-full overflow-hidden rounded-full bg-[var(--line-on-light)]">
                <div
                  className="h-full bg-[var(--accent)] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink)]">
                Uploading… {progress}%
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="h-10 w-10 rounded-full border border-[var(--line-on-light)] bg-[var(--warm-white)] flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-[var(--ink-muted)]">
                <path d="M10 3v14M3 10l7-7 7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ink)]">
                Drag image here
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--ink-faint)]">
                or{" "}
                <span className="text-[var(--accent)]">choose image</span>
              </p>
            </div>
            <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[var(--ink-faint)]">
              JPG / PNG / WebP · Max 10 MB
            </p>
          </>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}
