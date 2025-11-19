import { NextResponse } from 'next/server';

const ALLOWED_STATUSES = ['DRAFT', 'PUBLISHED'];

export async function PUT(req, { params }) {
  const { id } = await params;

  if (!id) {
    return new NextResponse(JSON.stringify({ error: 'Missing blog id in route.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new NextResponse(JSON.stringify({ error: 'Invalid JSON body.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { status } = body || {};
  if (!status || !ALLOWED_STATUSES.includes(status)) {
    return new NextResponse(
      JSON.stringify({ error: `Status must be one of: ${ALLOWED_STATUSES.join(', ')}` }),
      { status: 422, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Lazy-import DB client (replace '@/lib/prisma' with your DB client path).
  let prisma = null;
  try {
    prisma = (await import('@/lib/prisma')).default;
  } catch {
    // If you don't have a DB client wired, return a clear error so you can implement it.
    return new NextResponse(
      JSON.stringify({
        error:
          'Database client not configured. Add a DB client at `src/lib/prisma` (or change this file to use your DB).',
      }),
      { status: 501, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // If your blog primary key is numeric, convert `id` to Number here.
    const where = isNaN(Number(id)) ? { id } : { id: Number(id) };

    const updated = await prisma.blog.update({
      where,
      data: { status, publishedAt: status === 'PUBLISHED' ? new Date() : null },
    });

    return new NextResponse(JSON.stringify({ data: updated }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    // Basic error mapping; adjust for your DB client errors as needed.
    const message = err?.message || 'Failed to update blog status.';
    const statusCode = /Record to update not found/i.test(message) ? 404 : 500;
    return new NextResponse(JSON.stringify({ error: message }), {
      status: statusCode,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
