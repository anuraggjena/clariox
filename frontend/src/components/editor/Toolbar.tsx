import { useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_TEXT_COMMAND, FORMAT_ELEMENT_COMMAND, UNDO_COMMAND, REDO_COMMAND, CAN_UNDO_COMMAND, CAN_REDO_COMMAND, COMMAND_PRIORITY_CRITICAL, $getSelection, $isRangeSelection, $createParagraphNode } from "lexical";
import { $setBlocksType } from "@lexical/selection";
import { INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND, $isListNode, ListNode } from "@lexical/list";
import { $createHeadingNode, $isHeadingNode } from "@lexical/rich-text";
import type { HeadingTagType } from "@lexical/rich-text";

import { Undo2, Redo2, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify, List, ListOrdered, Heading1, Heading2, Type } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Toolbar() {
  const [editor] = useLexicalComposerContext();
  
  const [blockType, setBlockType] = useState<string>("paragraph");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    const removeUpdateListener = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;

        setIsBold(selection.hasFormat("bold"));
        setIsItalic(selection.hasFormat("italic"));
        setIsUnderline(selection.hasFormat("underline"));

        const anchorNode = selection.anchor.getNode();
        const element = anchorNode.getKey() === "root" ? anchorNode : anchorNode.getTopLevelElementOrThrow();

        if ($isListNode(element)) {
          setBlockType((element as ListNode).getListType()); 
        } else if ($isHeadingNode(element)) {
          setBlockType(element.getTag());
        } else {
          setBlockType(element.getType());
        }
      });
    });

    const removeUndoListener = editor.registerCommand(CAN_UNDO_COMMAND, (payload) => { setCanUndo(payload); return false; }, COMMAND_PRIORITY_CRITICAL);
    const removeRedoListener = editor.registerCommand(CAN_REDO_COMMAND, (payload) => { setCanRedo(payload); return false; }, COMMAND_PRIORITY_CRITICAL);

    return () => { removeUpdateListener(); removeUndoListener(); removeRedoListener(); };
  }, [editor]);

  const applyHeading = (level: HeadingTagType) => {
    if (blockType === level) return;
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) $setBlocksType(selection, () => $createHeadingNode(level));
    });
  };

  const applyParagraph = () => {
    if (blockType === "paragraph") return;
    if (blockType === "bullet") { editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined); return; }
    if (blockType === "number") { editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined); return; }
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) $setBlocksType(selection, () => $createParagraphNode());
    });
  };

  const activeStyle = "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100";
  const inactiveStyle = "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50";
  const divider = <div className="w-[1px] h-5 bg-zinc-200 dark:bg-zinc-800 mx-1 shrink-0"></div>;

  return (
    <div 
      className="flex items-center flex-nowrap gap-1 shrink-0"
      onMouseDown={(e) => e.preventDefault()} 
    >
      {/* History */}
      <Button variant="ghost" size="icon" disabled={!canUndo} className={`h-8 w-8 shrink-0 ${inactiveStyle} disabled:opacity-30`} onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}><Undo2 className="h-4 w-4" /></Button>
      <Button variant="ghost" size="icon" disabled={!canRedo} className={`h-8 w-8 shrink-0 ${inactiveStyle} disabled:opacity-30`} onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}><Redo2 className="h-4 w-4" /></Button>
      {divider}

      {/* Block Formats */}
      <Button variant="ghost" size="sm" onClick={applyParagraph} className={`h-8 px-2 shrink-0 gap-1.5 ${blockType === "paragraph" ? activeStyle : inactiveStyle}`}><Type className="h-4 w-4" /> <span className="text-xs hidden sm:inline-block">Normal</span></Button>
      <Button variant="ghost" size="sm" onClick={() => applyHeading("h1")} className={`h-8 px-2 shrink-0 ${blockType === "h1" ? activeStyle : inactiveStyle}`}><Heading1 className="h-4 w-4" /></Button>
      <Button variant="ghost" size="sm" onClick={() => applyHeading("h2")} className={`h-8 px-2 shrink-0 ${blockType === "h2" ? activeStyle : inactiveStyle}`}><Heading2 className="h-4 w-4" /></Button>
      {divider}

      {/* Text Formats */}
      <Button variant="ghost" size="icon" className={`h-8 w-8 shrink-0 ${isBold ? activeStyle : inactiveStyle}`} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}><Bold className="h-4 w-4" /></Button>
      <Button variant="ghost" size="icon" className={`h-8 w-8 shrink-0 ${isItalic ? activeStyle : inactiveStyle}`} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}><Italic className="h-4 w-4" /></Button>
      <Button variant="ghost" size="icon" className={`h-8 w-8 shrink-0 ${isUnderline ? activeStyle : inactiveStyle}`} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}><Underline className="h-4 w-4" /></Button>
      {divider}

      {/* Lists */}
      <Button variant="ghost" size="icon" className={`h-8 w-8 shrink-0 ${blockType === "bullet" ? activeStyle : inactiveStyle}`} onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}><List className="h-4 w-4" /></Button>
      <Button variant="ghost" size="icon" className={`h-8 w-8 shrink-0 ${blockType === "number" ? activeStyle : inactiveStyle}`} onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}><ListOrdered className="h-4 w-4" /></Button>
      {divider}

      {/* Alignment */}
      <Button variant="ghost" size="icon" className={`h-8 w-8 shrink-0 ${inactiveStyle}`} onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")}><AlignLeft className="h-4 w-4" /></Button>
      <Button variant="ghost" size="icon" className={`h-8 w-8 shrink-0 ${inactiveStyle}`} onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")}><AlignCenter className="h-4 w-4" /></Button>
      <Button variant="ghost" size="icon" className={`h-8 w-8 shrink-0 ${inactiveStyle}`} onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")}><AlignRight className="h-4 w-4" /></Button>
      <Button variant="ghost" size="icon" className={`h-8 w-8 shrink-0 ${inactiveStyle}`} onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify")}><AlignJustify className="h-4 w-4" /></Button>
    </div>
  );
}