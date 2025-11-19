import ArticleContent from '@/app/components/ArticleContent';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getBlog(id) {
  try {
    const res = await fetch(`/api/blogs/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) return notFound();

    return res.json();
  } catch (error) {
    console.error('Failed to fetch blog:', error);
    return notFound();
  }
}

export async function generateMetadata({ params }) {
  const { id } = params;
  const blog = await getBlog(id);

  if (!blog) {
    return { title: 'Article not found' };
  }

  return {
    title: blog.title,
    description: blog.description,
  };
}

export default async function BlogPage({ params }) {
  const { id } = params;
  const blog = await getBlog(id);

  return (
    <div className="bg-linear-to-br from-slate-50 to-white overflow-y-auto">
      <ArticleContent blog={blog} />
    </div>
  );
}
