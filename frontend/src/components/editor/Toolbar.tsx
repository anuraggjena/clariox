import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
} from "lexical";
import { $createHeadingNode } from "@lexical/rich-text";
import { Button } from "@/components/ui/button";

export default function Toolbar() {
  const [editor] = useLexicalComposerContext();

  const applyHeading = (level: "h1" | "h2" | "h3") => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      const anchorNode = selection.anchor.getNode();
      const block = anchorNode.getTopLevelElementOrThrow();
      if (!block) return;

      const alignment = block.getFormatType();

      const heading = $createHeadingNode(level);
      heading.setFormat(alignment); // ✅ no type error
      heading.append(...block.getChildren());

      block.replace(heading);
    });
  };

  const applyParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      const anchorNode = selection.anchor.getNode();
      const block = anchorNode.getTopLevelElementOrThrow();
      if (!block) return;

      const alignment = block.getFormatType();

      const paragraph = $createParagraphNode();
      paragraph.setFormat(alignment);
      paragraph.append(...block.getChildren());

      block.replace(paragraph);
    });
  };


  return (
    <div className="flex flex-wrap gap-2 border-b pb-2 mb-4">

      {/* Paragraph */}
      <Button variant="outline" size="sm" onClick={applyParagraph}>
        Normal
      </Button>

      {/* H1 */}
      <Button variant="outline" size="sm" onClick={() => applyHeading("h1")}>
        H1
      </Button>

      {/* H2 */}
      <Button variant="outline" size="sm" onClick={() => applyHeading("h2")}>
        H2
      </Button>

      {/* H3 */}
      <Button variant="outline" size="sm" onClick={() => applyHeading("h3")}>
        H3
      </Button>

      {/* Bold */}
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")
        }
      >
        Bold
      </Button>

      {/* Italic */}
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")
        }
      >
        Italic
      </Button>

      {/* Underline */}
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")
        }
      >
        Underline
      </Button>

      {/* Alignments */}
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")
        }
      >
        Left
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")
        }
      >
        Center
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")
        }
      >
        Right
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify")
        }
      >
        Justify
      </Button>

    </div>
  );
}
