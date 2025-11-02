import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-green max-w-none ${className}`}>
      <ReactMarkdown
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-3xl font-bold text-speech-green mb-4 mt-6 font-bricolage" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-2xl font-semibold text-speech-green mb-3 mt-5 font-bricolage" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-xl font-semibold text-green-700 mb-2 mt-4 font-bricolage" {...props} />
          ),
          h4: ({ node, ...props }) => (
            <h4 className="text-lg font-medium text-green-700 mb-2 mt-3 font-bricolage" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="text-gray-700 mb-3 leading-relaxed font-bricolage" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700 font-bricolage ml-4" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700 font-bricolage ml-4" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="mb-1 text-gray-700 font-bricolage" {...props} />
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-semibold text-green-800 font-bricolage" {...props} />
          ),
          em: ({ node, ...props }) => (
            <em className="italic text-green-700 font-bricolage" {...props} />
          ),
          code: ({ node, ...props }) => (
            <code className="bg-green-50 px-2 py-1 rounded text-sm font-mono text-green-800 font-bricolage" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-speech-green pl-4 italic text-gray-600 my-4 font-bricolage" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

