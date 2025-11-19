import ArticleContent from '@/app/components/ArticleContent';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';

async function getBlog(id) {
  // The `no-store` cache is implied by using Prisma directly in a dynamic component.
  try {
    const blog = await prisma.blog.findUnique({
      where: { id },
      include: {
        tags: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!blog) {
      return notFound();
    }

    // The object from Prisma is already in the correct format.
    return blog;
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
    <div className="bg-linear-to-br from-slate-50 to-white">
      <ArticleContent blog={blog} isAdmin={false} />
    </div>
  );
}
