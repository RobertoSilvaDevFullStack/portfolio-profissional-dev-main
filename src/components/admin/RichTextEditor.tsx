import { useEffect, useRef, useMemo } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Eye,
  Save,
  Type,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSave?: () => void;
}

const RichTextEditor = ({
  value,
  onChange,
  placeholder = "Escreva seu conteúdo aqui...",
  onSave,
}: RichTextEditorProps) => {
  const quillRef = useRef<ReactQuill>(null);

  // Configuração dos módulos do Quill
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ font: [] }],
          [{ size: ["small", false, "large", "huge"] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ script: "sub" }, { script: "super" }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ align: [] }],
          ["blockquote", "code-block"],
          ["link", "image", "video"],
          ["clean"],
        ],
      },
      clipboard: {
        matchVisual: false,
      },
    }),
    []
  );

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "list",
    "bullet",
    "indent",
    "align",
    "blockquote",
    "code-block",
    "link",
    "image",
    "video",
  ];

  // Atalhos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S ou Cmd+S para salvar
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (onSave) {
          onSave();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onSave]);

  // Contador de palavras e caracteres
  const getWordCount = (text: string) => {
    const strippedText = text.replace(/<[^>]*>/g, "").trim();
    return strippedText.length > 0
      ? strippedText.split(/\s+/).filter((word) => word.length > 0).length
      : 0;
  };

  const getCharCount = (text: string) => {
    return text.replace(/<[^>]*>/g, "").trim().length;
  };

  const wordCount = getWordCount(value);
  const charCount = getCharCount(value);

  // Conversão para Markdown (simplificada)
  const htmlToMarkdown = (html: string): string => {
    let markdown = html;

    // Headers
    markdown = markdown.replace(/<h1>(.*?)<\/h1>/g, "# $1\n\n");
    markdown = markdown.replace(/<h2>(.*?)<\/h2>/g, "## $1\n\n");
    markdown = markdown.replace(/<h3>(.*?)<\/h3>/g, "### $1\n\n");
    markdown = markdown.replace(/<h4>(.*?)<\/h4>/g, "#### $1\n\n");
    markdown = markdown.replace(/<h5>(.*?)<\/h5>/g, "##### $1\n\n");
    markdown = markdown.replace(/<h6>(.*?)<\/h6>/g, "###### $1\n\n");

    // Bold
    markdown = markdown.replace(/<strong>(.*?)<\/strong>/g, "**$1**");
    markdown = markdown.replace(/<b>(.*?)<\/b>/g, "**$1**");

    // Italic
    markdown = markdown.replace(/<em>(.*?)<\/em>/g, "*$1*");
    markdown = markdown.replace(/<i>(.*?)<\/i>/g, "*$1*");

    // Links
    markdown = markdown.replace(
      /<a href="(.*?)">(.*?)<\/a>/g,
      "[$2]($1)"
    );

    // Images
    markdown = markdown.replace(
      /<img src="(.*?)" alt="(.*?)">/g,
      "![$2]($1)"
    );
    markdown = markdown.replace(/<img src="(.*?)">/g, "![]($1)");

    // Lists
    markdown = markdown.replace(/<ul>(.*?)<\/ul>/gs, (match, content) => {
      return content.replace(/<li>(.*?)<\/li>/g, "- $1\n");
    });
    markdown = markdown.replace(/<ol>(.*?)<\/ol>/gs, (match, content) => {
      let counter = 1;
      return content.replace(/<li>(.*?)<\/li>/g, () => `${counter++}. $1\n`);
    });

    // Blockquotes
    markdown = markdown.replace(
      /<blockquote>(.*?)<\/blockquote>/g,
      "> $1\n\n"
    );

    // Code blocks
    markdown = markdown.replace(
      /<pre><code>(.*?)<\/code><\/pre>/gs,
      "```\n$1\n```\n\n"
    );
    markdown = markdown.replace(/<code>(.*?)<\/code>/g, "`$1`");

    // Paragraphs
    markdown = markdown.replace(/<p>(.*?)<\/p>/g, "$1\n\n");

    // Line breaks
    markdown = markdown.replace(/<br\s*\/?>/g, "\n");

    // Remove remaining HTML tags
    markdown = markdown.replace(/<[^>]*>/g, "");

    // Clean up extra newlines
    markdown = markdown.replace(/\n{3,}/g, "\n\n");

    return markdown.trim();
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="editor" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="bg-gray-800">
            <TabsTrigger value="editor" className="data-[state=active]:bg-gray-700">
              <FileText className="h-4 w-4 mr-2" />
              Editor
            </TabsTrigger>
            <TabsTrigger value="preview" className="data-[state=active]:bg-gray-700">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="markdown" className="data-[state=active]:bg-gray-700">
              <Type className="h-4 w-4 mr-2" />
              Markdown
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-gray-800 text-gray-300">
                <Type className="h-3 w-3 mr-1" />
                {wordCount} palavras
              </Badge>
              <Badge variant="outline" className="bg-gray-800 text-gray-300">
                {charCount} caracteres
              </Badge>
            </div>

            {onSave && (
              <Button
                onClick={onSave}
                size="sm"
                className="bg-light-cyan text-dark-navy hover:bg-light-cyan/90"
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar (Ctrl+S)
              </Button>
            )}
          </div>
        </div>

        <TabsContent value="editor" className="mt-0">
          <Card className="border-gray-700 overflow-hidden">
            <div className="quill-editor-wrapper">
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                formats={formats}
                placeholder={placeholder}
                className="bg-white text-gray-900"
              />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="mt-0">
          <Card className="border-gray-700 p-6 min-h-[400px]">
            <div
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: value || "<p>Nenhum conteúdo para visualizar</p>" }}
            />
          </Card>
        </TabsContent>

        <TabsContent value="markdown" className="mt-0">
          <Card className="border-gray-700 p-6">
            <pre className="bg-gray-900 p-4 rounded-lg overflow-auto max-h-[500px] text-gray-300 font-mono text-sm">
              {htmlToMarkdown(value) || "Nenhum conteúdo para converter"}
            </pre>
            <div className="mt-4 flex gap-2">
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(htmlToMarkdown(value));
                }}
                variant="outline"
                size="sm"
                className="border-gray-600 hover:bg-gray-700"
              >
                Copiar Markdown
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dicas de atalhos */}
      <Card className="border-gray-700 p-4 bg-gray-800/50">
        <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
          <ImageIcon className="h-4 w-4" />
          Atalhos de Teclado
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-400">
          <div>
            <kbd className="px-2 py-1 bg-gray-900 rounded">Ctrl+B</kbd> Negrito
          </div>
          <div>
            <kbd className="px-2 py-1 bg-gray-900 rounded">Ctrl+I</kbd> Itálico
          </div>
          <div>
            <kbd className="px-2 py-1 bg-gray-900 rounded">Ctrl+U</kbd>{" "}
            Sublinhado
          </div>
          <div>
            <kbd className="px-2 py-1 bg-gray-900 rounded">Ctrl+S</kbd> Salvar
          </div>
        </div>
      </Card>

      {/* Estilos customizados para o Quill */}
      <style>{`
        .quill-editor-wrapper .ql-container {
          min-height: 400px;
          font-size: 16px;
          background-color: white;
        }

        .quill-editor-wrapper .ql-editor {
          min-height: 400px;
          color: #1a1a1a;
        }

        .quill-editor-wrapper .ql-toolbar {
          background-color: #f8f9fa;
          border-bottom: 1px solid #dee2e6;
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
        }

        .quill-editor-wrapper .ql-stroke {
          stroke: #495057;
        }

        .quill-editor-wrapper .ql-fill {
          fill: #495057;
        }

        .quill-editor-wrapper .ql-picker-label {
          color: #495057;
        }

        .quill-editor-wrapper .ql-editor.ql-blank::before {
          color: #6c757d;
          font-style: italic;
        }

        .prose-invert h1,
        .prose-invert h2,
        .prose-invert h3,
        .prose-invert h4,
        .prose-invert h5,
        .prose-invert h6 {
          color: white;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
        }

        .prose-invert p {
          color: #d1d5db;
          margin-bottom: 1em;
        }

        .prose-invert ul,
        .prose-invert ol {
          color: #d1d5db;
          padding-left: 1.5em;
        }

        .prose-invert a {
          color: #60d5f0;
          text-decoration: underline;
        }

        .prose-invert code {
          background-color: #374151;
          color: #f3f4f6;
          padding: 0.2em 0.4em;
          border-radius: 0.25rem;
          font-size: 0.875em;
        }

        .prose-invert pre {
          background-color: #1f2937;
          color: #f3f4f6;
          padding: 1em;
          border-radius: 0.5rem;
          overflow-x: auto;
        }

        .prose-invert blockquote {
          border-left: 4px solid #60d5f0;
          padding-left: 1em;
          color: #9ca3af;
          font-style: italic;
        }

        .prose-invert img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
