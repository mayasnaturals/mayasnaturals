'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Underline } from '@tiptap/extension-underline';
import { TextAlign } from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Link } from '@tiptap/extension-link';
import { Image } from '@tiptap/extension-image';
import { Youtube } from '@tiptap/extension-youtube';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { 
  Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Link as LinkIcon, Image as ImageIcon, Video as VideoIcon,
  Table as TableIcon, Code, Sparkles, MoreHorizontal, Type, ChevronDown
} from 'lucide-react';
import { useEffect, useState } from 'react';

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const btnClass = "p-1.5 rounded hover:bg-gray-100 text-gray-600 transition-colors flex items-center justify-center";
  const activeClass = "bg-gray-200 text-black";
  const divider = <div className="w-px h-5 bg-gray-300 my-auto mx-1" />;

  const addImage = () => {
    const url = window.prompt('URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addVideo = () => {
    const url = window.prompt('YouTube URL');
    if (url) {
      editor.commands.setYoutubeVideo({ src: url });
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)
    if (url === null) {
      return
    }
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  };

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-white">
      {/* AI Button (Mock) */}
      <button type="button" className={`${btnClass} text-purple-600 hover:text-purple-700 hover:bg-purple-50`}>
        <Sparkles size={16} />
      </button>

      {divider}

      {/* Text Style Dropdown */}
      <div className="relative group">
        <button type="button" className={`${btnClass} px-2 gap-1 text-sm font-medium`}>
          Paragraph <ChevronDown size={14} />
        </button>
        {/* Simple mock dropdown - in reality this would use a proper select or portal menu */}
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg hidden group-hover:block z-50 min-w-[120px]">
          <button type="button" onClick={() => editor.chain().focus().setParagraph().run()} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">Paragraph</button>
          <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm font-bold">Heading 1</button>
          <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm font-semibold">Heading 2</button>
          <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm font-medium">Heading 3</button>
        </div>
      </div>

      {divider}

      {/* Formatting */}
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`${btnClass} ${editor.isActive('bold') ? activeClass : ''}`}>
        <Bold size={16} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`${btnClass} ${editor.isActive('italic') ? activeClass : ''}`}>
        <Italic size={16} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={`${btnClass} ${editor.isActive('underline') ? activeClass : ''}`}>
        <UnderlineIcon size={16} />
      </button>

      {/* Text Color (Mocked with Type icon) */}
      <button type="button" className={`${btnClass} px-2 gap-1`}>
        <Type size={16} /> <ChevronDown size={12} />
      </button>

      {divider}

      {/* Alignment */}
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={`${btnClass} ${editor.isActive({ textAlign: 'left' }) ? activeClass : ''}`}>
        <AlignLeft size={16} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={`${btnClass} ${editor.isActive({ textAlign: 'center' }) ? activeClass : ''}`}>
        <AlignCenter size={16} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={`${btnClass} ${editor.isActive({ textAlign: 'right' }) ? activeClass : ''}`}>
        <AlignRight size={16} />
      </button>

      {divider}

      {/* Insert */}
      <button type="button" onClick={setLink} className={`${btnClass} ${editor.isActive('link') ? activeClass : ''}`}>
        <LinkIcon size={16} />
      </button>
      <button type="button" onClick={addImage} className={btnClass}>
        <ImageIcon size={16} />
      </button>
      <button type="button" onClick={addVideo} className={btnClass}>
        <VideoIcon size={16} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} className={btnClass}>
        <TableIcon size={16} />
      </button>

      {divider}

      {/* More & Code */}
      <button type="button" className={btnClass}>
        <MoreHorizontal size={16} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={`${btnClass} ${editor.isActive('codeBlock') ? activeClass : ''}`}>
        <Code size={16} />
      </button>
    </div>
  );
};

export default function TipTapEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color,
      Link.configure({ openOnClick: false }),
      Image,
      Youtube,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({
        placeholder: 'Write a detailed product description...',
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base focus:outline-none min-h-[300px] p-4 max-w-none prose-img:rounded-xl prose-img:border prose-img:border-gray-200',
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all bg-white shadow-sm flex flex-col relative">
      <MenuBar editor={editor} />
      <div className="flex-1 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
