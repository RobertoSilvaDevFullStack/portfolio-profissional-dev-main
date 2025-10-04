import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileCode } from "lucide-react";

interface MarkdownPreviewProps {
  markdown: string;
}

const MarkdownPreview = ({ markdown }: MarkdownPreviewProps) => {
  // Conversão de Markdown para HTML (simplificada)
  const markdownToHtml = (md: string): string => {
    let html = md;

    // Headers
    html = html.replace(/^######\s+(.+)$/gm, "<h6>$1</h6>");
    html = html.replace(/^#####\s+(.+)$/gm, "<h5>$1</h5>");
    html = html.replace(/^####\s+(.+)$/gm, "<h4>$1</h4>");
    html = html.replace(/^###\s+(.+)$/gm, "<h3>$1</h3>");
    html = html.replace(/^##\s+(.+)$/gm, "<h2>$1</h2>");
    html = html.replace(/^#\s+(.+)$/gm, "<h1>$1</h1>");

    // Bold
    html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

    // Italic
    html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

    // Links
    html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');

    // Images
    html = html.replace(/!\[(.+?)\]\((.+?)\)/g, '<img src="$2" alt="$1" />');

    // Inline code
    html = html.replace(/`(.+?)`/g, "<code>$1</code>");

    // Code blocks
    html = html.replace(/```([\s\S]+?)```/g, "<pre><code>$1</code></pre>");

    // Blockquotes
    html = html.replace(/^>\s+(.+)$/gm, "<blockquote>$1</blockquote>");

    // Unordered lists
    html = html.replace(/^[-*]\s+(.+)$/gm, "<li>$1</li>");
    html = html.replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>");

    // Ordered lists
    html = html.replace(/^\d+\.\s+(.+)$/gm, "<li>$1</li>");

    // Paragraphs
    html = html.replace(/^(?!<[huo]|<li|<blockquote)(.+)$/gm, "<p>$1</p>");

    // Line breaks
    html = html.replace(/\n/g, "<br />");

    return html;
  };

  return (
    <Card className="bg-dark-navy/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <FileCode className="h-5 w-5" />
          Markdown Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{
            __html: markdownToHtml(markdown) || "<p>Nenhum conteúdo</p>",
          }}
        />
      </CardContent>

      <style>{`
        .prose-invert {
          color: #d1d5db;
        }

        .prose-invert h1 {
          color: white;
          font-size: 2.25em;
          font-weight: 800;
          margin-top: 0;
          margin-bottom: 0.8888889em;
        }

        .prose-invert h2 {
          color: white;
          font-size: 1.875em;
          font-weight: 700;
          margin-top: 1.5em;
          margin-bottom: 0.8em;
        }

        .prose-invert h3 {
          color: white;
          font-size: 1.5em;
          font-weight: 600;
          margin-top: 1.6em;
          margin-bottom: 0.6em;
        }

        .prose-invert h4,
        .prose-invert h5,
        .prose-invert h6 {
          color: white;
          font-weight: 600;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
        }

        .prose-invert p {
          margin-top: 1.25em;
          margin-bottom: 1.25em;
        }

        .prose-invert a {
          color: #60d5f0;
          text-decoration: underline;
          font-weight: 500;
        }

        .prose-invert a:hover {
          color: #4fc3dd;
        }

        .prose-invert strong {
          color: white;
          font-weight: 600;
        }

        .prose-invert code {
          color: white;
          background-color: #374151;
          padding: 0.2em 0.4em;
          border-radius: 0.25rem;
          font-size: 0.875em;
          font-weight: 600;
        }

        .prose-invert pre {
          background-color: #1f2937;
          color: #f3f4f6;
          overflow-x: auto;
          font-size: 0.875em;
          line-height: 1.7142857;
          margin-top: 1.7142857em;
          margin-bottom: 1.7142857em;
          border-radius: 0.375rem;
          padding: 0.8571429em 1.1428571em;
        }

        .prose-invert pre code {
          background-color: transparent;
          color: inherit;
          font-size: inherit;
          font-weight: inherit;
          padding: 0;
        }

        .prose-invert ul,
        .prose-invert ol {
          margin-top: 1.25em;
          margin-bottom: 1.25em;
          padding-left: 1.625em;
        }

        .prose-invert li {
          margin-top: 0.5em;
          margin-bottom: 0.5em;
        }

        .prose-invert blockquote {
          font-weight: 500;
          font-style: italic;
          color: #9ca3af;
          border-left-width: 0.25rem;
          border-left-color: #60d5f0;
          quotes: '"\\201C""\\201D""\\2018""\\2019"';
          margin-top: 1.6em;
          margin-bottom: 1.6em;
          padding-left: 1em;
        }

        .prose-invert img {
          margin-top: 2em;
          margin-bottom: 2em;
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
        }
      `}</style>
    </Card>
  );
};

export default MarkdownPreview;
