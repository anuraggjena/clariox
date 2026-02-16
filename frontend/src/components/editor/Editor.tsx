import { useEffect, useRef } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { $getRoot, $createParagraphNode } from "lexical";

import Toolbar from "./Toolbar";
import AIControls from "./AIControls";
import { useEditorStore } from "@/store/useEditorStore";

const theme = {
  paragraph: "mb-2",
  heading: {
    h1: "text-4xl font-bold mt-6 mb-3",
    h2: "text-3xl font-semibold mt-5 mb-2",
    h3: "text-2xl font-medium mt-4 mb-2",
  },
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline decoration-2",
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


export default function Editor() {
  const setContent = useEditorStore((s) => s.setContent);

  const initialConfig = {
    namespace: "ClarioxAI",
    theme,
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode],
    onError(error: Error) {
      console.error(error);
    },
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="space-y-4">

        <div className="flex items-center justify-between">
          <Toolbar />
          <AIControls />
        </div>

        <div className="border rounded-lg p-6 bg-card min-h-100">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="outline-none min-h-75" />
            }
            placeholder={
              <div className="text-muted-foreground">
                Start writing...
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />

          <HistoryPlugin />

          <OnChangePlugin
            onChange={(editorState) => {
              editorState.read(() => {
                const json = editorState.toJSON();
                setContent(json);
              });
            }}
          />

          <LoadContentPlugin />
        </div>
      </div>
    </LexicalComposer>
  );
}
