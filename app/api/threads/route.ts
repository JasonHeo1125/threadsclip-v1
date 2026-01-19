import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getThreadsOEmbed, extractTextFromHtml, isValidThreadsUrl, extractUsernameFromUrl } from '@/lib/threads/oembed';
import { SavedThread, Tag, ThreadTag } from '@prisma/client';

type ThreadWithTags = SavedThread & {
  tags: (ThreadTag & { tag: Tag })[];
};

function cleanThreadsUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const cleanPath = urlObj.pathname.replace(/\/$/, '');
    return `https://www.threads.net${cleanPath}`;
  } catch {
    return url;
  }
}

export async function POST(request: Request) {
  let session;
  try {
    session = await auth();
    console.log('Auth check:', { hasSession: !!session, hasUserId: !!session?.user?.id });
    if (!session?.user?.id) {
      console.error('Unauthorized: No valid session');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { url, memo, tagIds = [] } = await request.json();
    
    if (!url || !isValidThreadsUrl(url)) {
      return NextResponse.json({ error: 'Invalid Threads URL' }, { status: 400 });
    }

    const cleanedUrl = cleanThreadsUrl(url);

    const [count, user] = await Promise.all([
      prisma.savedThread.count({
        where: { userId: session.user.id }
      }),
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { storageLimit: true }
      })
    ]);

    const limit = user?.storageLimit || 1000;

    if (count >= limit) {
      return NextResponse.json({ error: `Storage limit reached (${limit} threads)` }, { status: 429 });
    }

    const existing = await prisma.savedThread.findUnique({
      where: {
        userId_originalUrl: {
          userId: session.user.id,
          originalUrl: cleanedUrl
        }
      }
    });

    if (existing) {
      return NextResponse.json({ error: 'Thread already saved', id: existing.id }, { status: 409 });
    }

    let oembedData;
    try {
      oembedData = await getThreadsOEmbed(cleanedUrl);
      console.log('oEmbed result:', oembedData ? 'Data received' : 'null returned');
    } catch (error) {
      console.error('oEmbed fetch failed:', { url: cleanedUrl, error });
      return NextResponse.json({ 
        error: 'Invalid or inaccessible Threads URL. Please check the link.',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 400 });
    }

    const usernameFromUrl = extractUsernameFromUrl(cleanedUrl);
    console.log('Extracted username:', usernameFromUrl);

    // Validate tagIds exist and belong to user
    if (tagIds.length > 0) {
      console.log('Validating tagIds:', tagIds);
      const validTags = await prisma.tag.findMany({
        where: {
          id: { in: tagIds },
          userId: session.user.id
        },
        select: { id: true }
      });

      console.log('Valid tags found:', validTags.length, 'Expected:', tagIds.length);
      if (validTags.length !== tagIds.length) {
        console.error('Invalid tag IDs detected');
        return NextResponse.json({ error: 'Invalid tag IDs' }, { status: 400 });
      }
    }

    console.log('Starting DB save...');
    const savedThread = await prisma.savedThread.create({
      data: {
        userId: session.user.id,
        originalUrl: cleanedUrl,
        contentSnippet: oembedData?.html ? extractTextFromHtml(oembedData.html) : null,
        imageUrl: oembedData?.thumbnail_url || null,
        authorName: oembedData?.author_name || (usernameFromUrl ? `@${usernameFromUrl}` : null),
        authorUsername: oembedData?.author_url?.split('/').pop()?.replace('@', '') || usernameFromUrl || null,
        memo: memo || null,
        tags: tagIds.length > 0 ? {
          create: tagIds.map((tagId: string) => ({
            tagId
          }))
        } : undefined
      }
    });

    console.log('Thread saved successfully:', { threadId: savedThread.id, userId: session.user.id });

    const response = NextResponse.json({ success: true, data: savedThread });
    console.log('Returning 200 OK response');
    return response;
  } catch (error) {
    console.error('Save thread error:', {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      userId: session?.user?.id
    });
    console.error('Returning 500 error response');
    return NextResponse.json(
      { error: 'Failed to save thread' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search') || '';
    const tagId = searchParams.get('tagId') || '';
    const sortOrder = searchParams.get('sortOrder') || 'newest';

    const where = {
      userId: session.user.id,
      ...(search ? {
        OR: [
          { memo: { contains: search, mode: 'insensitive' as const } },
          { authorName: { contains: search, mode: 'insensitive' as const } },
          { authorUsername: { contains: search, mode: 'insensitive' as const } },
        ]
      } : {}),
      ...(tagId ? {
        tags: {
          some: { tagId }
        }
      } : {})
    };

    const [threads, total, user] = await Promise.all([
      prisma.savedThread.findMany({
        where,
        include: {
          tags: {
            include: {
              tag: true
            }
          }
        },
        orderBy: { createdAt: sortOrder === 'oldest' ? 'asc' : 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.savedThread.count({ where }),
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { storageLimit: true }
      })
    ]);

    const threadsWithTags = (threads as ThreadWithTags[]).map((thread) => ({
      id: thread.id,
      user_id: thread.userId,
      original_url: thread.originalUrl,
      content_snippet: thread.contentSnippet,
      image_url: thread.imageUrl,
      author_name: thread.authorName,
      author_username: thread.authorUsername,
      memo: thread.memo,
      created_at: thread.createdAt.toISOString(),
      updated_at: thread.updatedAt.toISOString(),
      tags: thread.tags.map((tt: ThreadTag & { tag: Tag }) => ({
        id: tt.tag.id,
        user_id: tt.tag.userId,
        name: tt.tag.name,
        color: tt.tag.color,
        created_at: tt.tag.createdAt.toISOString()
      }))
    }));

    return NextResponse.json({
      data: threadsWithTags,
      total,
      hasMore: (offset + limit) < total,
      storageLimit: user?.storageLimit || 1000
    });
  } catch (error) {
    console.error('Get threads error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch threads' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, memo } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Thread ID required' }, { status: 400 });
    }

    if (memo && memo.length > 1000) {
      return NextResponse.json({ error: 'Memo exceeds 1000 characters limit' }, { status: 400 });
    }

    // Verify ownership
    const thread = await prisma.savedThread.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!thread) {
      return NextResponse.json({ error: 'Thread not found' }, { status: 404 });
    }

    if (thread.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const updatedThread = await prisma.savedThread.update({
      where: { id },
      data: { 
        memo: memo || null,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({ success: true, data: updatedThread });
  } catch (error) {
    console.error('Update thread error:', error);
    return NextResponse.json(
      { error: 'Failed to update thread' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Thread ID required' }, { status: 400 });
    }

    await prisma.savedThread.delete({
      where: {
        id,
        userId: session.user.id
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete thread error:', error);
    return NextResponse.json(
      { error: 'Failed to delete thread' },
      { status: 500 }
    );
  }
}
