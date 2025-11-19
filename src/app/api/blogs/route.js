import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const { imageUrl, description, title, content, tags } = await request.json();

    const tagOperations = tags.map((tag) =>
      prisma.tag.upsert({
        where: { name: tag },
        update: {},
        create: { name: tag },
      })
    );

    const createdTags = await prisma.$transaction(tagOperations);

    const newBlog = await prisma.blog.create({
      data: {
        imageUrl,
        title,
        description,
        content,
        tags: {
          connect: createdTags.map((tag) => ({ id: tag.id })),
        },
      },
    });
    return NextResponse.json(newBlog, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');

  const whereClause = status ? { status } : {};

  try {
    const blogs = await prisma.blog.findMany({
      include: {
        tags: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      where: whereClause,
      orderBy: {
        publishedAt: 'desc',
      },
    });
    return NextResponse.json(blogs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}
