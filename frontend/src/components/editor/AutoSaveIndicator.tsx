import { useEditorStore } from "@/store/useEditorStore";
import { RefreshCw, CheckCircle2 } from "lucide-react";

export default function AutoSaveIndicator() {
  const isSaving = useEditorStore((s) => s.isSaving);

  return (
    <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-300">
      {isSaving ? (
        <>
          <RefreshCw className="h-3.5 w-3.5 animate-spin text-blue-500" />
          <span className="text-zinc-500 dark:text-zinc-400 animate-pulse">
            Saving...
          </span>
        </>
      ) : (
        <>
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
          <span className="text-zinc-500 dark:text-zinc-400">
            Saved to cloud
          </span>
        </>
      )}
    </div>
  );
}