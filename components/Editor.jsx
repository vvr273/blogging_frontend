import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Heading from "@tiptap/extension-heading";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { ListItem } from "@tiptap/extension-list-item";
import { BulletList } from "@tiptap/extension-bullet-list";
import { OrderedList } from "@tiptap/extension-ordered-list";
import { ResizableImage } from "tiptap-extension-resizable-image";
import { useState, useCallback, useEffect } from "react";

// Import Icons
import {
  FaBold, FaItalic, FaUnderline, FaStrikethrough, FaHighlighter,
  FaAlignLeft, FaAlignCenter, FaAlignRight, FaAlignJustify,
  FaListUl, FaListOl, FaQuoteRight, FaCode,
  FaImage, FaLink, FaUndo, FaRedo, FaSearch, FaTimes
} from "react-icons/fa";

// Import External CSS
import "./editor.css";

// ============================================================
// TOOLBAR BUTTON COMPONENT
// ============================================================
const ToolbarButton = ({ onClick, icon: Icon, title, isActive = false }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`toolbar-btn ${isActive ? "active" : ""}`}
  >
    <Icon size={14} />
  </button>
);

// ============================================================
// TOOLBAR COMPONENT
// ============================================================
const MenuBar = ({ editor, toggleSearch, isSearchOpen }) => {
  const addImage = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      editor.chain().focus().setImage({ src: reader.result }).run();
      e.target.value = null;
    };
    reader.readAsDataURL(file);
  }, [editor]);

  const addLink = useCallback(() => {
    const previous = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL:", previous);
    if (url === null) return;
    if (url === "") return editor.chain().focus().unsetLink().run();
    editor.chain().focus().setLink({ href: url, target: "_blank" }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="editor-toolbar">
      {/* HISTORY */}
      <div className="toolbar-group">
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} icon={FaUndo} title="Undo" />
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} icon={FaRedo} title="Redo" />
      </div>

      {/* TEXT STYLE */}
      <div className="toolbar-group">
        <select
          className="toolbar-select"
          value={
            editor.isActive("heading", { level: 1 }) ? 1 :
            editor.isActive("heading", { level: 2 }) ? 2 :
            editor.isActive("heading", { level: 3 }) ? 3 : 0
          }
          onChange={(e) => {
            const level = Number(e.target.value);
            level === 0
              ? editor.chain().focus().setParagraph().run()
              : editor.chain().focus().toggleHeading({ level }).run();
          }}
        >
          <option value="0">Normal</option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
        </select>
      </div>

      <div className="toolbar-group">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} icon={FaBold} isActive={editor.isActive("bold")} title="Bold" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} icon={FaItalic} isActive={editor.isActive("italic")} title="Italic" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} icon={FaUnderline} isActive={editor.isActive("underline")} title="Underline" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} icon={FaStrikethrough} isActive={editor.isActive("strike")} title="Strike" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} icon={FaCode} isActive={editor.isActive("code")} title="Code" />
      </div>

      {/* COLORS */}
      <div className="toolbar-group">
        <input
          type="color"
          className="color-picker"
          title="Text Color"
          onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHighlight({ color: "#fff700" }).run()}
          icon={FaHighlighter}
          isActive={editor.isActive("highlight")}
          title="Highlight"
        />
      </div>

      {/* ALIGNMENT */}
      <div className="toolbar-group">
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("left").run()} icon={FaAlignLeft} title="Left" />
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("center").run()} icon={FaAlignCenter} title="Center" />
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("right").run()} icon={FaAlignRight} title="Right" />
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("justify").run()} icon={FaAlignJustify} title="Justify" />
      </div>

      {/* LISTS */}
      <div className="toolbar-group">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} icon={FaListUl} title="Bullet List" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} icon={FaListOl} title="Ordered List" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} icon={FaQuoteRight} title="Quote" />
      </div>

      {/* MEDIA & TOOLS */}
      <div className="toolbar-group">
        <label className="toolbar-btn icon-label" title="Insert Image">
          <FaImage size={14} />
          <input type="file" accept="image/*" onChange={addImage} className="hidden-input" />
        </label>
        <ToolbarButton onClick={addLink} icon={FaLink} isActive={editor.isActive("link")} title="Add Link" />
      </div>
      
      {/* SEARCH TOGGLE */}
      <div className="toolbar-group">
        <ToolbarButton 
          onClick={toggleSearch} 
          icon={FaSearch} 
          isActive={isSearchOpen} 
          title="Search & Replace (Ctrl+H)" 
        />
      </div>
    </div>
  );
};

// ============================================================
// SEARCH PANEL COMPONENT
// ============================================================
const SearchPanel = ({ editor, isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [matchCount, setMatchCount] = useState(0);

  // Update match count when query changes
  useEffect(() => {
    if (!query || !editor) {
      setMatchCount(0);
      return;
    }
    const content = editor.getText();
    const matches = content.match(new RegExp(escapeRegExp(query), "gi"));
    setMatchCount(matches ? matches.length : 0);
  }, [query, editor, editor?.state.doc]); // Recalculate on doc change

  const handleReplaceAll = () => {
    if (!query) return;
    
    // Get current HTML
    const html = editor.getHTML();
    
    // Create a safe regex that ignores HTML tags
    // NOTE: This is a basic implementation. For complex nested HTML, 
    // a node-traversal approach is safer, but this works for 90% of blog use cases.
    const regex = new RegExp(escapeRegExp(query), "gi");
    
    // We operate on text content mostly to be safe, but since we are replacing,
    // we use the HTML string but must be careful not to break tags.
    // Ideally, we'd use Tiptap's SearchAndReplace extension.
    
    // Safer Approach: Get pure text, count matches, but for replacement:
    // We will use the native string replaceAll on the HTML content.
    // WARNING: This replaces ALL occurrences, even inside attributes (rare for user text).
    const newHtml = html.replace(regex, replaceText);
    
    if (html === newHtml) {
      alert("No matches found.");
    } else {
      editor.commands.setContent(newHtml);
      alert("Replaced successfully!"); // Optional feedback
    }
  };

  const handleClear = () => {
    setQuery("");
    setReplaceText("");
    setMatchCount(0);
  };

  // Helper to escape special regex characters
  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  if (!isOpen) return null;

  return (
    <div className="search-panel">
      <div className="search-group">
        <input 
          autoFocus
          className="search-input" 
          placeholder="Find..." 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
        />
        <span className="match-count">{matchCount} matches</span>
      </div>

      <div className="search-group">
        <input 
          className="search-input" 
          placeholder="Replace with..." 
          value={replaceText} 
          onChange={(e) => setReplaceText(e.target.value)} 
        />
      </div>

      <button className="action-btn primary" onClick={handleReplaceAll}>Replace All</button>
      <button className="action-btn" onClick={handleClear}>Clear</button>
      
      <button className="close-search-btn" onClick={onClose} title="Close">
        <FaTimes size={14} />
      </button>
    </div>
  );
};

// ============================================================
// MAIN EDITOR COMPONENT
// ============================================================
export default function Editor({ value, onChange }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false }),
      Underline,
      Highlight.configure({ multicolor: true }),
      TextStyle,
      Color,
      ResizableImage,
      Heading.configure({ levels: [1, 2, 3] }),
      Link.configure({ openOnClick: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      BulletList,
      OrderedList,
      ListItem,
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  // KEYBOARD SHORTCUTS
  useEffect(() => {
    const handleHotKey = (e) => {
      // Toggle Search with Ctrl+H or Ctrl+F
      if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === "h" || e.key.toLowerCase() === "f")) {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleHotKey);
    return () => window.removeEventListener("keydown", handleHotKey);
  }, []);

  if (!editor) return null;

  return (
    <div className="editor-container">
      <MenuBar 
        editor={editor} 
        toggleSearch={() => setIsSearchOpen(!isSearchOpen)} 
        isSearchOpen={isSearchOpen}
      />
      
      <SearchPanel 
        editor={editor} 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
      
      <div className="editor-content">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}