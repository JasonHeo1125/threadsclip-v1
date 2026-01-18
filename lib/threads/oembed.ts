export interface ThreadsOEmbedResponse {
  title?: string;
  author_name: string;
  author_url?: string;
  thumbnail_url?: string;
  html?: string;
  provider_name: string;
  width?: number;
  height?: number;
}

export async function getThreadsOEmbed(url: string): Promise<ThreadsOEmbedResponse | null> {
  if (!url.includes('threads.net') && !url.includes('threads.com')) {
    return null;
  }

  try {
    const urlObj = new URL(url);
    const cleanUrl = `${urlObj.origin}${urlObj.pathname}`;
    const normalizedUrl = cleanUrl.replace('threads.net', 'threads.com');
    const oembedUrl = `https://www.threads.com/api/oembed?url=${encodeURIComponent(normalizedUrl)}`;
    
    console.log('Original URL:', url);
    console.log('Clean URL:', cleanUrl);
    console.log('Normalized URL:', normalizedUrl);
    console.log('oEmbed URL:', oembedUrl);
    
    const response = await fetch(oembedUrl, {
      headers: {
        'User-Agent': 'ThreadClip/1.0',
      },
      redirect: 'follow',
    });
    
    console.log('Response status:', response.status);

    if (!response.ok) {
      console.error(`oEmbed failed: ${response.status}`);
      return null;
    }

    return response.json();
  } catch (error) {
    console.error('Threads oEmbed error:', error);
    return null;
  }
}

export function extractTextFromHtml(html: string): string {
  const tempDiv = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim();
  
  return tempDiv.slice(0, 300);
}

export function isValidThreadsUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname === 'threads.net' || 
           urlObj.hostname === 'www.threads.net' ||
           urlObj.hostname === 'threads.com' ||
           urlObj.hostname === 'www.threads.com';
  } catch {
    return false;
  }
}

export function extractThreadsUrl(text: string): string | null {
  const match = text.match(/https?:\/\/(?:www\.)?threads\.(?:net|com)\/[^\s]+/);
  return match ? match[0] : null;
}

export function extractUsernameFromUrl(url: string): string | null {
  const match = url.match(/threads\.(?:net|com)\/@([^/]+)/);
  return match ? match[1] : null;
}
