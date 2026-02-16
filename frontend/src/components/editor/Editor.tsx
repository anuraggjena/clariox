import { useEffect, useRef } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";

import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { $getRoot, $createParagraphNode } from "lexical";

import Toolbar from "./Toolbar";
import AIControls from "./AIControls";
import { useEditorStore } from "@/store/useEditorStore";

const theme = {
  paragraph: "mb-4 text-[17px] leading-[1.7] text-zinc-800 dark:text-zinc-200",
  heading: {
    h1: "text-4xl font-serif font-bold mt-10 mb-6 text-zinc-900 dark:text-zinc-100 tracking-tight",
    h2: "text-2xl font-semibold mt-8 mb-4 text-zinc-900 dark:text-zinc-100 tracking-tight",
    h3: "text-xl font-semibold mt-6 mb-3 text-zinc-900 dark:text-zinc-100",
  },
  list: {
    ol: "list-decimal pl-8 mb-4 space-y-1 text-[17px] text-zinc-800 dark:text-zinc-200 leading-[1.7]",
    ul: "list-disc pl-8 mb-4 space-y-1 text-[17px] text-zinc-800 dark:text-zinc-200 leading-[1.7]",
    listitem: "pl-2",
  },
  text: {
    bold: "font-semibold text-zinc-900 dark:text-zinc-100",
    italic: "italic",
    underline: "underline underline-offset-4 decoration-zinc-300 dark:decoration-zinc-700 decoration-2",
  }
};

function LoadContentPlugin() {
  const [editor] = useLexicalComposerContext();
  const content = useEditorStore((s) => s.content);
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (!content || hasLoaded.current) return;
    editor.update(() => {
      try {
        const editorState = editor.parseEditorState(content);
        editor.setEditorState(editorState);
      } catch {
        const root = $getRoot();
        root.clear();
        root.append($createParagraphNode());
      }
    });
    hasLoaded.current = true;
  }, [content, editor]);
  return null;
}

// Accept Title Props from EditorPage
export default function Editor({ title, setTitle }: { title: string, setTitle: (t: string) => void }) {
  const setContent = useEditorStore((s) => s.setContent);

  const initialConfig = {
    namespace: "ClarioX",
    theme,
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode],
    onError: (error: Error) => console.error(error),
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="flex flex-col h-full bg-[#F3F3F4] dark:bg-zinc-950 relative">
        
        {/* --- SECONDARY FORMATTING RIBBON --- */}
        <div className="sticky top-0 z-40 w-full bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-4 py-1.5 flex items-center justify-between shadow-sm overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <Toolbar />
          <AIControls />
        </div>

        {/* --- DOCUMENT CANVAS (Gray Background) --- */}
        <div className="flex-1 overflow-y-auto w-full flex justify-center py-10 px-4 sm:px-8">
          
          {/* THE PAPER */}
          <div className="w-full max-w-[816px] bg-white dark:bg-zinc-900 shadow-md ring-1 ring-zinc-200 dark:ring-zinc-800 min-h-[1056px] px-10 sm:px-24 py-16 flex flex-col shrink-0">
            
            {/* Title on Paper */}
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Document Title"
              className="w-full text-5xl font-serif font-bold text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-300 dark:placeholder:text-zinc-700 outline-none bg-transparent mb-10 resize-none leading-tight"
            />

            {/* Lexical Editor Content */}
            <div className="relative flex-1 cursor-text">
              <RichTextPlugin
                contentEditable={<ContentEditable className="outline-none min-h-[500px] pb-32" />}
                placeholder={
                  <div className="absolute top-0 left-0 text-zinc-400 dark:text-zinc-500 pointer-events-none text-[17px] select-none">
                    Start writing...
                  </div>
                }
                ErrorBoundary={LexicalErrorBoundary}
              />
              <HistoryPlugin />
              <ListPlugin />
              <OnChangePlugin
                onChange={(editorState) => {
                  editorState.read(() => setContent(editorState.toJSON()));
                }}
              />
              <LoadContentPlugin />
            </div>

          </div>
        </div>
      </div>
    </LexicalComposer>
  );
}