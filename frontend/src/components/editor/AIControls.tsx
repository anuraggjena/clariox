import { useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, $createParagraphNode, $createTextNode } from "lexical";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import { Sparkles, Wand2, CheckCheck, AlignLeft, Loader2 } from "lucide-react";

export default function AIControls() {
  const [editor] = useLexicalComposerContext();
  const [loading, setLoading] = useState<string | null>(null);

  const handleAI = async (mode: string) => {
    let plainText = "";
    editor.getEditorState().read(() => { plainText = $getRoot().getTextContent(); });
    if (!plainText.trim()) return;

    try {
      setLoading(mode);
      const res = await api.post("/api/ai/generate", { text: plainText, type: mode });
      const aiText = res.data.result;

      editor.update(() => {
        const root = $getRoot();
        root.clear();
        const paragraph = $createParagraphNode();
        paragraph.append($createTextNode(aiText));
        root.append(paragraph);
      });
    } catch (error) {
      console.error("AI failed:", error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex items-center p-1 bg-gradient-to-r from-indigo-50/80 to-purple-50/80 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-100/50 dark:border-indigo-800/30 rounded-lg shrink-0 ml-4">
      <div className="flex items-center px-3 py-1 border-r border-indigo-200/50 dark:border-indigo-800/50 mr-1 select-none">
        <Sparkles className="h-3.5 w-3.5 text-indigo-500 mr-1.5 animate-pulse" />
        <span className="text-[10px] font-bold text-indigo-800 dark:text-indigo-300 uppercase tracking-widest hidden lg:inline-block">Assistant</span>
      </div>
      <div className="flex items-center gap-0.5">
        <Button variant="ghost" size="sm" disabled={loading !== null} onClick={() => handleAI("summary")} className="h-7 px-2.5 text-indigo-700 hover:bg-indigo-100/80">
          {loading === "summary" ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <AlignLeft className="h-3.5 w-3.5 mr-1.5" />}
          <span className="text-xs font-medium">Summarize</span>
        </Button>
        <Button variant="ghost" size="sm" disabled={loading !== null} onClick={() => handleAI("grammar")} className="h-7 px-2.5 text-indigo-700 hover:bg-indigo-100/80">
          {loading === "grammar" ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <CheckCheck className="h-3.5 w-3.5 mr-1.5" />}
          <span className="text-xs font-medium">Fix Grammar</span>
        </Button>
        <Button variant="ghost" size="sm" disabled={loading !== null} onClick={() => handleAI("improve")} className="h-7 px-2.5 text-indigo-700 hover:bg-indigo-100/80">
          {loading === "improve" ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <Wand2 className="h-3.5 w-3.5 mr-1.5" />}
          <span className="text-xs font-medium hidden md:inline-block">Improve Writing</span>
          <span className="text-xs font-medium md:hidden">Improve</span>
        </Button>
      </div>
    </div>
  );
}