import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    const blog = await prisma.blog.findUnique({
      include: {
        tags: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      where: { id },
    });
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }
    return NextResponse.json(blog);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch blog' }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { title, content, description, imageUrl, tags } = body;

    const updatedBlog = await prisma.blog.update({
      where: { id },
      data: {
        title,
        content,
        description,
        imageUrl,
        ...(tags && {
          tags: {
            set: [],
            connectOrCreate: tags.map((tag) => ({
              where: { name: tag },
              create: { name: tag },
            })),
          },
        }),
      },
      include: { tags: true },
    });

    return NextResponse.json(updatedBlog);
  } catch (error) {
    console.log(error);
    console.error('Error updating blog:', error);
    return NextResponse.json({ error: 'Failed to patch blog' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  try {
    await prisma.blog.delete({
      where: { id },
    });
    return new Response(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 });
  }
}
