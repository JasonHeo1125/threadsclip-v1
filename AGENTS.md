# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## 💬 Communication & Design Rules

### 🇰🇷 Language Rules
- **Response Language**: 모든 답변과 설명은 반드시 **한국어**로 작성한다.
- **Thinking Process**: 문제를 분석하고 해결책을 도출하는 사고 과정도 한국어로 진행한다.
- **Code Comments**: 코드 내 주석과 설명 문서(README 등)도 한국어를 우선적으로 사용한다.

### 🎨 Design Guidelines (Tailwind CSS 4)
- **Button Ratio**: 버튼 패딩은 상하:좌우 = 1:2 비율을 유지한다. (예: `py-2 px-4`)
- **Button Height**: 기본 버튼 높이는 약 38px 정도로 설정한다.
- **Framework**: 반드시 **Tailwind CSS 4** 문법을 사용하며, `rounded-md` 또는 `rounded-lg`를 기본값으로 한다.
- **Landing Page Structure**:
  1. Hero Section (강력한 헤드라인 + CTA)
  2. Social Proof (신뢰 지표/로고)
  3. Core Features (핵심 기능 3-4개)
  4. FAQ/Objection Handling
  5. Final CTA

## Project Overview
ThreadClip is a Next.js 14+ (App Router) PWA for saving and searching Threads posts. Users can bookmark Threads URLs, add memos for searchability, and organize saved posts. The app uses Supabase for authentication (Google OAuth) and data storage, with a 100-thread limit per user.

## Development Commands

### Core Commands
- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Create production build
- `npm start` - Run production server
- `npm run lint` - Run ESLint

### Environment Setup
Required environment variables in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Architecture

### Tech Stack
- **Framework**: Next.js 16 with App Router, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Backend**: Supabase (Auth + PostgreSQL)
- **PWA**: Web Share Target API support

### Key Directories
- `app/` - Next.js App Router pages and API routes
  - `app/api/threads/` - CRUD operations for saved threads
  - `app/api/tags/` - Tag management endpoints
  - `app/share-target/` - PWA share target handler
  - `app/(auth)/` - Auth-related pages (login, callback)
- `lib/` - Shared utilities and core logic
  - `lib/supabase/` - Supabase client initialization (client/server/middleware)
  - `lib/threads/` - Threads.net oEmbed API integration
  - `lib/i18n/` - Internationalization (Korean/English)
- `components/` - React components
  - `components/ui/` - Reusable UI components
  - `components/thread/` - Thread-specific components
- `types/` - TypeScript type definitions

### Authentication Flow
- Middleware (`middleware.ts`) checks auth on every request using Supabase session
- Protected routes redirect to `/login` if unauthenticated
- Auth callback handled at `app/(auth)/auth/callback/route.ts`
- Public routes: `/login`, `/auth/callback`, `/guide`, `/privacy`, `/terms`, `/data-deletion`
- Share target (`/share-target`) has conditional auth (prompts login if needed)

### Data Model (Supabase)
**Tables:**
- `profiles` - User profile data (linked to auth.users)
- `saved_threads` - Bookmarked Threads posts with metadata
- `tags` - User-created tags
- `thread_tags` - Many-to-many relationship between threads and tags

**Key constraints:**
- Maximum 100 threads per user (enforced in POST `/api/threads`)
- Unique URL per user (duplicate check in POST `/api/threads`)

### Threads API Integration
- Uses Threads.com oEmbed API to fetch post metadata
- URL normalization: converts `threads.net` to `threads.com` for API compatibility
- Extracts: author name/username, thumbnail, content snippet (first 300 chars)
- Helper functions in `lib/threads/oembed.ts`: `getThreadsOEmbed()`, `isValidThreadsUrl()`, `extractUsernameFromUrl()`

### Internationalization
- Supported languages: Korean (`ko`), English (`en`)
- Translation keys defined in `lib/i18n/translations.ts`
- Use `useTranslation()` hook to access translations in components
- All UI text should be internationalized

### Image Handling
- Next.js Image component configured for:
  - `scontent.cdninstagram.com` (Instagram CDN)
  - `*.threads.net`
  - `lh3.googleusercontent.com` (Google profile photos)
- Configuration in `next.config.ts`

## Code Patterns

### Supabase Client Usage
- **Client components**: Use `createClient()` from `@/lib/supabase/client`
- **Server components/actions**: Use `createClient()` from `@/lib/supabase/server`
- **Middleware**: Use `updateSession()` from `@/lib/supabase/middleware`
- All clients are typed with `Database` type from `@/types/database`

### API Route Pattern
```typescript
// Always check authentication first
const { data: { user } } = await supabase.auth.getUser();
if (!user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

### Error Handling
- Use try-catch blocks in API routes
- Return appropriate HTTP status codes (401, 400, 409, 429, 500)
- Client-side: Use `showToast()` from `@/components/ui/Toast` for user feedback

### Type Safety
- Database types are auto-generated in `types/database.ts`
- Use type aliases: `SavedThread`, `Tag`, `Profile`, `SavedThreadWithTags`
- Cast API responses when using complex joins

## Common Tasks

### Adding a New API Endpoint
1. Create route handler in `app/api/[name]/route.ts`
2. Implement HTTP methods (GET, POST, PUT, DELETE)
3. Always check authentication first
4. Use typed Supabase client from `@/lib/supabase/server`
5. Return `NextResponse.json()` with appropriate status codes

### Adding Translations
1. Add key-value pairs to both `ko` and `en` in `lib/i18n/translations.ts`
2. Update `TranslationStructure` type if needed
3. Use in components via `const { t } = useTranslation();`

### PWA Features
- Manifest defined in `app/manifest.ts`
- Share target receives URLs at `/share-target` with query params `url` or `text`
- Extracts Threads URLs from shared content using regex

## Important Notes
- Never commit `.env.local` (contains Supabase credentials)
- Thread URL format: `https://threads.net/@username/post/xxxxx`
- Storage limit is hardcoded to 100 threads per user
- Client-side search filters by: memo, author_name, author_username, tags
- All timestamps use ISO 8601 format (Supabase default)
