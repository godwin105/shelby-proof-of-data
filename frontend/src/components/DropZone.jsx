import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FileCheck, UploadCloud } from "lucide-react";

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 ** 2).toFixed(2)} MB`;
}

export default function DropZone({
  onFile,
  file,
  label = "Drag and drop a file, or click to browse",
}) {
  const onDrop = useCallback(
    (accepted) => {
      if (accepted[0]) onFile(accepted[0]);
    },
    [onFile],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`relative cursor-pointer rounded-2xl border border-dashed transition-all duration-200 min-h-[15rem] sm:min-h-[17rem] p-6 sm:p-8
        flex flex-col items-center justify-center gap-4 text-center outline-none focus-visible:ring-2 focus-visible:ring-shelby-accent/70 ${
          isDragActive
            ? "border-shelby-accent bg-shelby-accent/10 scale-[1.01]"
            : file
              ? "border-shelby-success/50 bg-shelby-success/10"
              : "border-shelby-border bg-shelby-surface/80 hover:border-shelby-accent/50 hover:bg-shelby-accent/5"
        }`}
    >
      <input {...getInputProps()} />
      <div
        className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
          file
            ? "bg-shelby-success/10 border border-shelby-success/30"
            : "bg-shelby-accent/10 border border-shelby-accent/25"
        }`}
      >
        {file ? (
          <FileCheck size={28} className="text-shelby-success" />
        ) : (
          <UploadCloud size={28} className={`text-shelby-accent ${isDragActive ? "animate-bounce" : ""}`} />
        )}
      </div>

      {file ? (
        <div className="w-full min-w-0">
          <p className="font-display font-semibold text-shelby-text truncate">{file.name}</p>
          <p className="text-sm text-shelby-muted mt-1">
            {formatSize(file.size)} / {file.type || "unknown type"}
          </p>
          <p className="text-xs text-shelby-accent mt-3 font-mono">Click or drop to replace</p>
        </div>
      ) : (
        <div className="max-w-sm">
          <p className="font-display font-semibold text-shelby-text">{label}</p>
          <p className="text-sm text-shelby-muted mt-1">Any file type, up to 100 MB</p>
        </div>
      )}
    </div>
  );
}
