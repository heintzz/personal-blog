// components/ArticleContent.tsx
'use client';

import Link from 'next/link';

export default function ArticleContent({ blog, isAdmin = true }) {
  return (
    <article className="max-w-7xl mx-auto px-4 py-12 md:py-16">
      {/* Header */}
      <header className="mb-10 md:mb-14">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-light tracking-tight text-black mb-4">
              {blog.title}
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">{blog.description}</p>
          </div>
          {!isAdmin && (
            <Link href="/blogs">
              <button className="cursor-pointer h-fit px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-slate-800 transition-all shadow-md hover:shadow-lg whitespace-nowrap">
                Back
              </button>
            </Link>
          )}
        </div>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 border-t border-slate-200 pt-6">
          <time dateTime={isAdmin ? blog.createdAt : blog.publishedAt}>
            {new Date(isAdmin ? blog.createdAt : blog.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          <span>•</span>
          <span>{Math.ceil(blog.content.split(' ').length / 200)} min read</span>
          {blog.tags && blog.tags.length > 0 && (
            <>
              <span>•</span>
              <div className="flex gap-2">
                {blog.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-block px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </header>

      {/* Cover Image */}
      {blog.imageUrl && (
        <div className="mb-10 md:mb-14 mx-0">
          <img
            src={blog.imageUrl}
            alt={blog.title}
            className="w-full h-96 object-cover rounded-lg md:rounded-xl"
          />
        </div>
      )}
      {/* Content */}
      <div className="prose prose-lg max-w-none text-slate-800">
        <div dangerouslySetInnerHTML={{ __html: blog.content }} />
      </div>

      {/* Footer */}
      {isAdmin && (
        <footer className="border-t border-slate-200">
          <div className="flex items-center justify-between pt-10">
            <div>
              <p className="text-sm text-slate-600">Published on</p>
              {blog.publishedAt ? (
                <p className="text-black font-medium">
                  {new Date(blog.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              ) : (
                <p>Not published</p>
              )}
            </div>

            <a
              href={`/admin/articles/${blog.id}/edit`}
              className="px-6 py-2 bg-black text-white rounded-lg font-medium hover:bg-slate-800 transition-all"
            >
              Edit
            </a>
          </div>
        </footer>
      )}

      {/* Tailwind Prose Styles */}
      <style>{`
        .prose {
          color: #1f2937;
        }

        .prose h1 {
          font-size: 2.25rem;
          font-weight: 700;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
          color: #000;
        }

        .prose h2 {
          font-size: 1.875rem;
          font-weight: 700;
          margin-top: 1.3em;
          margin-bottom: 0.4em;
          color: #000;
        }

        .prose h3 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 1.2em;
          margin-bottom: 0.4em;
          color: #000;
        }

        .prose p {
          margin-top: 1em;
          margin-bottom: 1em;
          line-height: 1.75;
        }

        .prose ul,
        .prose ol {
          margin-top: 1em;
          margin-bottom: 1em;
          padding-left: 2.5rem;
        }

        .prose li {
          margin-top: 0.5em;
          margin-bottom: 0.5em;
        }

        .prose ul li {
          list-style-type: disc;
        }

        .prose ol li {
          list-style-type: decimal;
        }

        .prose a {
          color: #2563eb;
          text-decoration: underline;
          transition: color 0.2s;
        }

        .prose a:hover {
          color: #1d4ed8;
        }

        .prose code {
          background-color: #f3f4f6;
          color: #1f2937;
          padding: 0.2em 0.4em;
          border-radius: 0.25rem;
          font-family: 'Courier New', monospace;
          font-size: 0.9em;
        }

        .prose pre {
          background: #1f2937;
          color: #f3f4f6;
          padding: 1.5rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin-top: 1em;
          margin-bottom: 1em;
        }

        .prose pre code {
          background: none;
          color: inherit;
          padding: 0;
          font-size: inherit;
        }

        .prose blockquote {
          border-left: 4px solid #e5e7eb;
          color: #6b7280;
          font-style: italic;
          margin: 1.5em 0;
          padding-left: 1.5em;
        }

        .prose img {
          max-width: 100%;
          height: auto;
          margin: 1.5em 0;
          border-radius: 0.5rem;
        }

        .prose hr {
          border: none;
          border-top: 1px solid #e5e7eb;
          margin: 2em 0;
        }

        .prose table {
          border-collapse: collapse;
          width: 100%;
          margin: 1.5em 0;
        }

        .prose thead {
          background: #f3f4f6;
        }

        .prose th,
        .prose td {
          border: 1px solid #e5e7eb;
          padding: 0.75em;
          text-align: left;
        }
      `}</style>
    </article>
  );
}
