import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { Tag } from '@prisma/client';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tags = await prisma.tag.findMany({
      where: { userId: session.user.id },
      orderBy: { name: 'asc' }
    });

    const data = tags.map((tag: Tag) => ({
      id: tag.id,
      user_id: tag.userId,
      name: tag.name,
      color: tag.color,
      created_at: tag.createdAt.toISOString()
    }));

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Get tags error:', error);
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, color } = await request.json();

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Tag name required' }, { status: 400 });
    }

    const tag = await prisma.tag.create({
      data: {
        userId: session.user.id,
        name: name.trim(),
        color: color || '#8B5CF6'
      }
    });

    const data = {
      id: tag.id,
      user_id: tag.userId,
      name: tag.name,
      color: tag.color,
      created_at: tag.createdAt.toISOString()
    };

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Create tag error:', error);
    if ((error as { code?: string }).code === 'P2002') {
      return NextResponse.json({ error: 'Tag already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create tag' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, name } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Tag ID required' }, { status: 400 });
    }

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Tag name required' }, { status: 400 });
    }

    const tag = await prisma.tag.update({
      where: {
        id,
        userId: session.user.id
      },
      data: { name: name.trim() }
    });

    const data = {
      id: tag.id,
      user_id: tag.userId,
      name: tag.name,
      color: tag.color,
      created_at: tag.createdAt.toISOString()
    };

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Update tag error:', error);
    if ((error as { code?: string }).code === 'P2002') {
      return NextResponse.json({ error: 'Tag already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to update tag' }, { status: 500 });
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
      return NextResponse.json({ error: 'Tag ID required' }, { status: 400 });
    }

    await prisma.tag.delete({
      where: {
        id,
        userId: session.user.id
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete tag error:', error);
    return NextResponse.json({ error: 'Failed to delete tag' }, { status: 500 });
  }
}
