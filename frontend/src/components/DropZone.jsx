import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, FileCheck } from "lucide-react";

export default function DropZone({ onFile, file, label = "Drag & drop any file, or click to browse" }) {
  const onDrop = useCallback((accepted) => { if (accepted[0]) onFile(accepted[0]); }, [onFile]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false });

  return (
    <div
      {...getRootProps()}
      className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200 p-10
        flex flex-col items-center justify-center gap-4 text-center
        ${isDragActive
          ? "border-shelby-accent bg-shelby-accent/5 scale-[1.01]"
          : file
          ? "border-shelby-success/40 bg-shelby-success/5"
          : "border-shelby-border bg-shelby-surface hover:border-shelby-accent/40 hover:bg-shelby-accent/5"
        }`}
    >
      <input {...getInputProps()} />
      <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300
        ${file
          ? "bg-shelby-success/10 border border-shelby-success/30"
          : "bg-shelby-accent/10 border border-shelby-accent/20"}`}
      >
        {file
          ? <FileCheck size={28} className="text-shelby-success" />
          : <UploadCloud size={28} className={`text-shelby-accent ${isDragActive ? "animate-bounce" : ""}`} />
        }
      </div>
      {file ? (
        <div>
          <p className="font-display font-semibold text-shelby-text">{file.name}</p>
          <p className="text-sm text-shelby-muted mt-1">{(file.size / 1024).toFixed(1)} KB · {file.type || "unknown type"}</p>
          <p className="text-xs text-shelby-accent mt-2 font-mono">Click or drop to replace</p>
        </div>
      ) : (
        <div>
          <p className="font-display font-semibold text-shelby-text">{label}</p>
          <p className="text-sm text-shelby-muted mt-1">Any file type · Max 100 MB</p>
        </div>
      )}
    </div>
  );
}
