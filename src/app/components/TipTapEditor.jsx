'use client';

import BulletList from '@tiptap/extension-bullet-list';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered
} from 'lucide-react';
import { useEffect, useState } from 'react';

export function TiptapEditor({ value, onChange }) {
  const [isMounted, setIsMounted] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: 'tiptap-bullet-list',
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: 'tiptap-ordered-list',
        },
      }),
      ListItem,
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({
        allowBase64: true,
      }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !editor) {
    return (
      <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50 h-96 flex items-center justify-center">
        <p className="text-slate-500">Loading editor...</p>
      </div>
    );
  }

  const ToolButton = ({ isActive, onClick, children, title }) => (
    <button
      onClick={onClick}
      title={title}
      type="button"
      className={`p-2 rounded-lg transition-all ${
        isActive ? 'bg-black text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-slate-50 border-b border-slate-200 p-3 flex flex-wrap gap-2">
        {/* Headings */}
        <div className="flex gap-1 border-r border-slate-300 pr-2">
          <ToolButton
            isActive={editor.isActive('heading', { level: 1 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </ToolButton>
          <ToolButton
            isActive={editor.isActive('heading', { level: 2 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </ToolButton>
          <ToolButton
            isActive={editor.isActive('heading', { level: 3 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            title="Heading 3"
          >
            <Heading3 className="w-4 h-4" />
          </ToolButton>
        </div>

        {/* Text formatting */}
        <div className="flex gap-1 border-r border-slate-300 pr-2">
          <ToolButton
            isActive={editor.isActive('bold')}
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </ToolButton>
          <ToolButton
            isActive={editor.isActive('italic')}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </ToolButton>
          <ToolButton
            isActive={editor.isActive('code')}
            onClick={() => editor.chain().focus().toggleCode().run()}
            title="Inline Code"
          >
            <Code className="w-4 h-4" />
          </ToolButton>
        </div>

        {/* Lists */}
        <div className="flex gap-1 border-r border-slate-300 pr-2">
          <ToolButton
            isActive={editor.isActive('bulletList')}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </ToolButton>
          <ToolButton
            isActive={editor.isActive('orderedList')}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            title="Ordered List"
          >
            <ListOrdered className="w-4 h-4" />
          </ToolButton>
        </div>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} className="tiptap-editor" />

      {/* Editor Styles */}
      <style>{`
        .tiptap-editor .ProseMirror {
          outline: none;
          min-height: 384px;
          padding: 1rem;
          font-size: 1rem;
          line-height: 1.5;
        }

        .tiptap-editor .ProseMirror > * + * {
          margin-top: 0.75em;
        }

        .tiptap-editor .ProseMirror ul,
        .tiptap-editor .ProseMirror ol {
          padding: 0 1.5rem;
          margin: 0.75em 0;
        }

        .tiptap-editor .ProseMirror li {
          margin: 0.25em 0;
        }

        .tiptap-editor .ProseMirror ul {
          list-style-type: disc;
        }

        .tiptap-editor .ProseMirror ol {
          list-style-type: decimal;
        }

        .tiptap-editor .ProseMirror ul li,
        .tiptap-editor .ProseMirror ol li {
          display: list-item;
          margin-left: 1em;
        }

        .tiptap-editor .ProseMirror h1 {
          font-size: 1.875rem;
          font-weight: 700;
          margin-top: 0.5em;
          margin-bottom: 0.5em;
        }

        .tiptap-editor .ProseMirror h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 0.4em;
          margin-bottom: 0.4em;
        }

        .tiptap-editor .ProseMirror h3 {
          font-size: 1.25rem;
          font-weight: 700;
          margin-top: 0.4em;
          margin-bottom: 0.4em;
        }

        .tiptap-editor .ProseMirror code {
          background-color: #f3f4f6;
          color: #1f2937;
          padding: 0.2em 0.4em;
          border-radius: 0.25rem;
          font-family: monospace;
          font-size: 0.9em;
        }

        .tiptap-editor .ProseMirror pre {
          background: #1f2937;
          color: #f3f4f6;
          font-family: monospace;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
        }

        .tiptap-editor .ProseMirror pre code {
          color: inherit;
          padding: 0;
          background: none;
          font-size: inherit;
        }

        .tiptap-editor .ProseMirror img {
          max-width: 100%;
          height: auto;
          margin: 1rem 0;
          border-radius: 0.5rem;
        }

        .tiptap-editor .ProseMirror a {
          color: #2563eb;
          text-decoration: underline;
          cursor: pointer;
        }

        .tiptap-editor .ProseMirror a:hover {
          color: #1d4ed8;
        }

        .tiptap-editor .ProseMirror blockquote {
          border-left: 4px solid #e5e7eb;
          margin: 1rem 0;
          padding-left: 1rem;
          color: #6b7280;
          font-style: italic;
        }

        .tiptap-editor .ProseMirror strong {
          font-weight: 700;
        }

        .tiptap-editor .ProseMirror em {
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
