"use client";

import { useRef, useState } from "react";
import { EditorContent, EditorContext, useEditor } from "@tiptap/react";

// --- Tiptap Core Extensions ---
import { TableKit } from "@tiptap/extension-table";
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Highlight } from "@tiptap/extension-highlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Selection } from "@tiptap/extensions";
import { Edit, Table } from "lucide-react";

// --- UI Primitives ---
import { Button } from "../../../components/tiptap-ui-primitive/button";
import { Spacer } from "../../../components/tiptap-ui-primitive/spacer";
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "../../../components/tiptap-ui-primitive/toolbar";

// --- Tiptap Node ---
import { HorizontalRule } from "../../../components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension";
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss";
import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/heading-node/heading-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";

// --- Tiptap UI ---
import { HeadingDropdownMenu } from "../../../components/tiptap-ui/heading-dropdown-menu";
import { ListDropdownMenu } from "../../../components/tiptap-ui/list-dropdown-menu";
import { BlockquoteButton } from "../../../components/tiptap-ui/blockquote-button";
import { CodeBlockButton } from "../../../components/tiptap-ui/code-block-button";
import { ColorHighlightPopoverContent } from "../../../components/tiptap-ui/color-highlight-popover";
import {
  LinkContent,
  LinkButton,
} from "../../../components/tiptap-ui/link-popover";
import { MarkButton } from "../../../components/tiptap-ui/mark-button";
import { TextAlignButton } from "../../../components/tiptap-ui/text-align-button";
import { UndoRedoButton } from "../../../components/tiptap-ui/undo-redo-button";

// --- Icons ---
import { ArrowLeftIcon } from "../../../components/tiptap-icons/arrow-left-icon";
import { HighlighterIcon } from "../../../components/tiptap-icons/highlighter-icon";
import { LinkIcon } from "../../../components/tiptap-icons/link-icon";

// --- Hooks ---
import { useIsBreakpoint } from "../../../hooks/use-is-breakpoint";
import { useWindowSize } from "../../../hooks/use-window-size";
import { useCursorVisibility } from "../../../hooks/use-cursor-visibility";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// --- Styles ---
import "@/components/tiptap-templates/simple/simple-editor.scss";

const MainToolbarContent = ({
  editor,
  onLinkClick,
  isMobile,
}: {
  editor;
  onHighlighterClick: () => void;
  onLinkClick: () => void;
  isMobile: boolean;
}) => {
  return (
    <>
      <Spacer />
      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <HeadingDropdownMenu levels={[1, 2, 3, 4]} portal={isMobile} />
        <ListDropdownMenu
          types={["bulletList", "orderedList", "taskList"]}
          portal={isMobile}
        />
        <BlockquoteButton />
        <CodeBlockButton />
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
        <MarkButton type="underline" />
        <LinkButton onClick={onLinkClick} />
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <MarkButton type="superscript" />
        <MarkButton type="subscript" />
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="bg-white p-2 aspect-square hover:bg-[#eaeaeb] rounded-lg ">
              <Table size={16} className="text-gray-500" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="rounded-xl shadow-xl">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Table Options</DropdownMenuLabel>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                      .run()
                  }
                >
                  Insert table
                </Button>
                <Button
                  onClick={() => editor.chain().focus().deleteTable().run()}
                >
                  Delete table
                </Button>
                <Button
                  onClick={() => editor.chain().focus().addColumnBefore().run()}
                >
                  Add column before
                </Button>
                <Button
                  onClick={() => editor.chain().focus().addColumnAfter().run()}
                >
                  Add column after
                </Button>
                <Button
                  onClick={() => editor.chain().focus().deleteColumn().run()}
                >
                  Delete column
                </Button>
                <Button
                  onClick={() => editor.chain().focus().addRowBefore().run()}
                >
                  Add row before
                </Button>
                <Button
                  onClick={() => editor.chain().focus().addRowAfter().run()}
                >
                  Add row after
                </Button>
                <Button
                  onClick={() => editor.chain().focus().deleteRow().run()}
                >
                  Delete row
                </Button>
                <Button
                  onClick={() => editor.chain().focus().mergeCells().run()}
                >
                  Merge cells
                </Button>
                <Button
                  onClick={() => editor.chain().focus().splitCell().run()}
                >
                  Split cell
                </Button>
                <Button
                  onClick={() =>
                    editor.chain().focus().toggleHeaderColumn().run()
                  }
                >
                  Toggle header column
                </Button>
                <Button
                  onClick={() => editor.chain().focus().toggleHeaderRow().run()}
                >
                  Toggle header row
                </Button>
                <Button
                  onClick={() =>
                    editor.chain().focus().toggleHeaderCell().run()
                  }
                >
                  Toggle header cell
                </Button>
                <Button
                  onClick={() => editor.chain().focus().mergeOrSplit().run()}
                >
                  Merge or split
                </Button>
                <Button
                  onClick={() =>
                    editor.chain().focus().setCellAttribute("colspan", 2).run()
                  }
                >
                  Set cell attribute
                </Button>
                <Button
                  onClick={() => editor.chain().focus().fixTables().run()}
                >
                  Fix tables
                </Button>
                <Button
                  onClick={() => editor.chain().focus().goToNextCell().run()}
                >
                  Go to next cell
                </Button>
                <Button
                  onClick={() =>
                    editor.chain().focus().goToPreviousCell().run()
                  }
                >
                  Go to previous cell
                </Button>
              </div>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </ToolbarGroup>

      <Spacer />
      {isMobile && <ToolbarSeparator />}
    </>
  );
};

const MobileToolbarContent = ({
  type,
  onBack,
}: {
  type: "highlighter" | "link";
  onBack: () => void;
}) => (
  <>
    <ToolbarGroup>
      <Button data-style="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === "highlighter" ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : (
          <LinkIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === "highlighter" ? (
      <ColorHighlightPopoverContent />
    ) : (
      <LinkContent />
    )}
  </>
);

export function SimpleEditor({ content, setContent, handleSaveContent }) {
  const isMobile = useIsBreakpoint();
  const { height } = useWindowSize();
  const [mobileView, setMobileView] = useState<"main" | "highlighter" | "link">(
    "main",
  );
  const toolbarRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
        class: "simple-editor",
      },
      handleKeyDown: (view, event) => {
        if (event.key === "Tab") {
          event.preventDefault();
          const { state, dispatch } = view;
          const { from, to } = state.selection;

          dispatch(state.tr.insertText("\t", from, to));
          return true;
        }

        if (event.key.toLowerCase() === "s" && event.ctrlKey) {
          event.preventDefault();
          handleSaveContent();
          return true;
        }

        return false;
      },
    },
    extensions: [
      TableKit.configure({
        table: { resizable: true },
      }),
      StarterKit.configure({
        horizontalRule: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      Selection,
    ],
    content: content ? content : null,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      setContent(json);
    },
  });

  const rect = useCursorVisibility({
    editor,
    // overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
    overlayHeight: 0,
  });

  return (
    <div className="simple-editor-wrapper">
      <EditorContext.Provider value={{ editor }}>
        <Toolbar
          ref={toolbarRef}
          style={{
            ...(isMobile
              ? {
                  bottom: `calc(100% - ${height - rect.y}px)`,
                }
              : {}),
          }}
          className="shadow-sm"
        >
          {mobileView === "main" ? (
            <MainToolbarContent
              editor={editor}
              onHighlighterClick={() => setMobileView("highlighter")}
              onLinkClick={() => setMobileView("link")}
              isMobile={isMobile}
            />
          ) : (
            <MobileToolbarContent
              type={mobileView === "highlighter" ? "highlighter" : "link"}
              onBack={() => setMobileView("main")}
            />
          )}
        </Toolbar>

        <EditorContent
          editor={editor}
          role="presentation"
          className="simple-editor-content"
        />
      </EditorContext.Provider>
    </div>
  );
}
