-- ============================================
-- ThreadClip Phase 1 Update: Add memo field
-- Run this in Supabase SQL Editor
-- ============================================

-- 메모 필드 추가
ALTER TABLE saved_threads ADD COLUMN IF NOT EXISTS memo TEXT;

-- 검색 인덱스 업데이트 (메모 포함)
DROP INDEX IF EXISTS idx_saved_threads_content_search;
CREATE INDEX idx_saved_threads_content_search 
ON saved_threads USING gin(to_tsvector('simple', COALESCE(memo, '') || ' ' || COALESCE(author_name, '') || ' ' || COALESCE(author_username, '')));

-- 검색 함수 업데이트 (메모 검색 포함)
CREATE OR REPLACE FUNCTION search_threads(
  p_user_id UUID,
  p_query TEXT,
  p_limit INT DEFAULT 20
)
RETURNS TABLE(
  id UUID,
  original_url TEXT,
  content_snippet TEXT,
  image_url TEXT,
  author_name TEXT,
  author_username TEXT,
  memo TEXT,
  created_at TIMESTAMPTZ,
  score FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    st.id,
    st.original_url,
    st.content_snippet,
    st.image_url,
    st.author_name,
    st.author_username,
    st.memo,
    st.created_at,
    ts_rank(
      to_tsvector('simple', COALESCE(st.memo, '') || ' ' || COALESCE(st.author_name, '') || ' ' || COALESCE(st.author_username, '')),
      plainto_tsquery('simple', p_query)
    )::FLOAT AS score
  FROM saved_threads st
  WHERE st.user_id = p_user_id
    AND (
      to_tsvector('simple', COALESCE(st.memo, '') || ' ' || COALESCE(st.author_name, '') || ' ' || COALESCE(st.author_username, ''))
      @@ plainto_tsquery('simple', p_query)
      OR st.memo ILIKE '%' || p_query || '%'
      OR st.author_name ILIKE '%' || p_query || '%'
      OR st.author_username ILIKE '%' || p_query || '%'
    )
  ORDER BY score DESC, st.created_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
