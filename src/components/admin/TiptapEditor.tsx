"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

type Props = {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

function ToolbarButton({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      disabled={disabled}
      title={title}
      aria-label={title}
      aria-pressed={active}
      className={`flex h-7 w-7 items-center justify-center rounded text-[11px] font-serif transition-colors ${
        active
          ? "bg-[var(--ink)] text-[var(--warm-white)]"
          : "text-[var(--ink-muted)] hover:bg-[var(--champagne)] hover:text-[var(--ink)]"
      } disabled:opacity-40`}
    >
      {children}
    </button>
  );
}

export default function TiptapEditor({ content, onChange, placeholder }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        blockquote: {},
        bulletList: {},
        orderedList: {},
        listItem: {},
        bold: {},
        italic: {},
        link: {
          openOnClick: false,
          HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
        },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: "field-light prose prose-sm max-w-none min-h-[280px] w-full resize-y px-4 py-3 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const setLink = () => {
    const url = window.prompt("Enter URL:");
    if (!url) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div className="overflow-hidden rounded border border-[var(--line-on-light)] focus-within:border-[var(--ink)]">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-[var(--line-on-light)] bg-[var(--ivory)] px-2 py-1.5">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Bold"
        >
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Italic"
        >
          <em>I</em>
        </ToolbarButton>
        <div className="mx-1 h-4 w-px bg-[var(--line-on-light)]" aria-hidden />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          H3
        </ToolbarButton>
        <div className="mx-1 h-4 w-px bg-[var(--line-on-light)]" aria-hidden />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Bullet list"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="2.5" cy="3.5" r="1.5" fill="currentColor"/>
            <circle cx="2.5" cy="7" r="1.5" fill="currentColor"/>
            <circle cx="2.5" cy="10.5" r="1.5" fill="currentColor"/>
            <line x1="5.5" y1="3.5" x2="12.5" y2="3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            <line x1="5.5" y1="7" x2="12.5" y2="7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            <line x1="5.5" y1="10.5" x2="12.5" y2="10.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Ordered list"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <text x="0.5" y="4.5" fontSize="4.5" fill="currentColor" fontFamily="monospace">1.</text>
            <text x="0.5" y="8" fontSize="4.5" fill="currentColor" fontFamily="monospace">2.</text>
            <text x="0.5" y="11.5" fontSize="4.5" fill="currentColor" fontFamily="monospace">3.</text>
            <line x1="5.5" y1="3.5" x2="12.5" y2="3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            <line x1="5.5" y1="7" x2="12.5" y2="7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            <line x1="5.5" y1="10.5" x2="12.5" y2="10.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Blockquote"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 4h3v3H3V4zm5 0h3v3H8V4zM3 9h3v3H3V9zm5 0h3v3H8V9z" fill="currentColor" opacity="0.3"/>
            <path d="M2 4h4v4H2V4zm6 0h4v4H8V4zm-6 5h4v4H2V9zm6 0h4v4H8V9z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
          </svg>
        </ToolbarButton>
        <div className="mx-1 h-4 w-px bg-[var(--line-on-light)]" aria-hidden />
        <ToolbarButton
          onClick={setLink}
          active={editor.isActive("link")}
          title="Insert link"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M6 8.5a3.5 3.5 0 004.95 0l1.5-1.5a3.5 3.5 0 00-4.95-4.95L7 2.55" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            <path d="M8 5.5a3.5 3.5 0 00-4.95 0L1.55 7a3.5 3.5 0 004.95 4.95L7 11.45" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
        </ToolbarButton>
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="bg-[var(--warm-white)]"
      />

      {/* Hidden textarea for form submission */}
    </div>
  );
}
