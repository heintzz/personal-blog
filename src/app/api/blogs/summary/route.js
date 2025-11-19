import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const [totalBlogs, draftBlogs, totalUniqueTags] = await Promise.all([
      prisma.blog.count(),
      prisma.blog.count({ where: { status: 'DRAFT' } }),
      prisma.tag.count(),
    ]);

    let summary = {
      totalBlogs,
      draftBlogs,
      totalUniqueTags,
    };
    return NextResponse.json(summary);
  } catch (error) {
    console.error('Error fetching blog summary:', error);
    return NextResponse.json({ error: 'Error fetching blog summary' }, { status: 500 });
  }
}
