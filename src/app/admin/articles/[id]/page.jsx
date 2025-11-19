import ArticleContent from '@/app/components/ArticleContent';
import { notFound } from 'next/navigation';

async function getBlog(id) {
  try {
    const res = await fetch(`http://localhost:3000/api/blogs/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return notFound();
    }

    return res.json();
  } catch (error) {
    console.error('Failed to fetch blog:', error);
    return notFound();
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const blog = await getBlog(id);

  if (!blog) {
    return {
      title: 'Article not found',
    };
  }

  return {
    title: blog.title,
    description: blog.description,
  };
}

export default async function BlogPage({ params }) {
  const { id } = await params;
  const blog = await getBlog(id);

  return (
    <div className="bg-linear-to-br from-slate-50 to-white overflow-y-auto">
      <ArticleContent blog={blog} />
    </div>
  );
}
