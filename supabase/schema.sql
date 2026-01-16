-- ============================================
-- ThreadClip Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. 사용자 프로필 테이블
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 저장된 쓰레드 테이블
CREATE TABLE IF NOT EXISTS saved_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  original_url TEXT NOT NULL,
  content_snippet TEXT,
  image_url TEXT,
  author_name TEXT,
  author_username TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, original_url)
);

-- 3. 태그 테이블
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#8B5CF6',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, name)
);

-- 4. 쓰레드-태그 연결 테이블
CREATE TABLE IF NOT EXISTS thread_tags (
  thread_id UUID REFERENCES saved_threads(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (thread_id, tag_id)
);

-- ============================================
-- Row Level Security (RLS) 설정
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE thread_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can manage own threads" ON saved_threads
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own tags" ON tags
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own thread_tags" ON thread_tags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM saved_threads 
      WHERE saved_threads.id = thread_tags.thread_id 
      AND saved_threads.user_id = auth.uid()
    )
  );

-- ============================================
-- 트리거 함수들
-- ============================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_saved_threads_updated_at
  BEFORE UPDATE ON saved_threads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 인덱스 (성능 최적화)
-- ============================================

CREATE INDEX IF NOT EXISTS idx_saved_threads_user_id ON saved_threads(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_threads_created_at ON saved_threads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tags_user_id ON tags(user_id);
CREATE INDEX IF NOT EXISTS idx_thread_tags_thread_id ON thread_tags(thread_id);
CREATE INDEX IF NOT EXISTS idx_thread_tags_tag_id ON thread_tags(tag_id);

-- ============================================
-- 전체 텍스트 검색 (PostgreSQL 기본)
-- PGroonga 사용 시 아래 주석 해제
-- ============================================

CREATE INDEX IF NOT EXISTS idx_saved_threads_content_search 
ON saved_threads USING gin(to_tsvector('simple', COALESCE(content_snippet, '') || ' ' || COALESCE(author_name, '')));

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
    st.created_at,
    ts_rank(
      to_tsvector('simple', COALESCE(st.content_snippet, '') || ' ' || COALESCE(st.author_name, '')),
      plainto_tsquery('simple', p_query)
    )::FLOAT AS score
  FROM saved_threads st
  WHERE st.user_id = p_user_id
    AND (
      to_tsvector('simple', COALESCE(st.content_snippet, '') || ' ' || COALESCE(st.author_name, ''))
      @@ plainto_tsquery('simple', p_query)
      OR st.content_snippet ILIKE '%' || p_query || '%'
      OR st.author_name ILIKE '%' || p_query || '%'
    )
  ORDER BY score DESC, st.created_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 사용자당 저장 제한 확인 함수 (100개)
-- ============================================

CREATE OR REPLACE FUNCTION check_thread_limit()
RETURNS TRIGGER AS $$
DECLARE
  thread_count INT;
BEGIN
  SELECT COUNT(*) INTO thread_count
  FROM saved_threads
  WHERE user_id = NEW.user_id;
  
  IF thread_count >= 100 THEN
    RAISE EXCEPTION 'Thread storage limit reached (100 threads per user)';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_thread_limit
  BEFORE INSERT ON saved_threads
  FOR EACH ROW EXECUTE FUNCTION check_thread_limit();
