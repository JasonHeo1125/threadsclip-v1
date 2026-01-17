import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getThreadsOEmbed, extractTextFromHtml, isValidThreadsUrl, extractUsernameFromUrl } from '@/lib/threads/oembed';
import { STORAGE_LIMITS } from '@/lib/constants';

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
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { url, memo, tagIds = [] } = await request.json();
    
    if (!url || !isValidThreadsUrl(url)) {
      return NextResponse.json({ error: 'Invalid Threads URL' }, { status: 400 });
    }

    const cleanedUrl = cleanThreadsUrl(url);

    const { count } = await supabase
      .from('saved_threads')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (count && count >= STORAGE_LIMITS.FREE_TIER) {
      return NextResponse.json({ error: `Storage limit reached (${STORAGE_LIMITS.FREE_TIER} threads)` }, { status: 429 });
    }

    const { data: existing } = await supabase
      .from('saved_threads')
      .select('id')
      .eq('user_id', user.id)
      .eq('original_url', cleanedUrl)
      .single() as { data: { id: string } | null };

    if (existing) {
      return NextResponse.json({ error: 'Thread already saved', id: existing.id }, { status: 409 });
    }

    const oembedData = await getThreadsOEmbed(cleanedUrl);
    const usernameFromUrl = extractUsernameFromUrl(cleanedUrl);

    const threadData = {
      user_id: user.id,
      original_url: cleanedUrl,
      content_snippet: oembedData?.html ? extractTextFromHtml(oembedData.html) : null,
      image_url: oembedData?.thumbnail_url || null,
      author_name: oembedData?.author_name || (usernameFromUrl ? `@${usernameFromUrl}` : null),
      author_username: oembedData?.author_url?.split('/').pop()?.replace('@', '') || usernameFromUrl || null,
      memo: memo || null,
    };

    const { data: savedThread, error } = await supabase
      .from('saved_threads')
      .insert(threadData as never)
      .select()
      .single() as { data: { id: string } | null; error: unknown };

    if (error) {
      throw error;
    }

    if (tagIds.length > 0 && savedThread) {
      const threadTagsData = tagIds.map((tagId: string) => ({
        thread_id: savedThread.id,
        tag_id: tagId,
      }));

      await supabase
        .from('thread_tags')
        .insert(threadTagsData as never);
    }

    return NextResponse.json({ success: true, data: savedThread });
  } catch (error) {
    console.error('Save thread error:', error);
    return NextResponse.json(
      { error: 'Failed to save thread' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search') || '';
    const tagId = searchParams.get('tagId') || '';
    const sortOrder = searchParams.get('sortOrder') || 'newest';

    interface ThreadWithJoins {
      id: string;
      user_id: string;
      original_url: string;
      content_snippet: string | null;
      image_url: string | null;
      author_name: string | null;
      author_username: string | null;
      memo: string | null;
      created_at: string;
      updated_at: string;
      thread_tags?: Array<{ tag_id: string; tags: unknown }>;
    }

    let query = supabase
      .from('saved_threads')
      .select(`
        *,
        thread_tags (
          tag_id,
          tags (*)
        )
      `, { count: 'exact' })
      .eq('user_id', user.id);

    if (search) {
      query = query.or(`memo.ilike.%${search}%,author_name.ilike.%${search}%,author_username.ilike.%${search}%`);
    }

    query = query.order('created_at', { ascending: sortOrder === 'oldest' });
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query as { 
      data: ThreadWithJoins[] | null; 
      error: unknown;
      count: number | null;
    };

    if (error) {
      throw error;
    }

    let threadsWithTags = (data || []).map(thread => ({
      ...thread,
      tags: thread.thread_tags?.map((tt) => tt.tags) || [],
    }));

    if (tagId) {
      threadsWithTags = threadsWithTags.filter(thread => 
        thread.tags?.some((tag: unknown) => (tag as { id?: string })?.id === tagId)
      );
    }

    return NextResponse.json({ 
      data: threadsWithTags,
      total: count || 0,
      hasMore: (offset + limit) < (count || 0)
    });
  } catch (error) {
    console.error('Get threads error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch threads' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Thread ID required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('saved_threads')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete thread error:', error);
    return NextResponse.json(
      { error: 'Failed to delete thread' },
      { status: 500 }
    );
  }
}
