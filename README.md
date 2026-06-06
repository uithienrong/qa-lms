# QA LMS — AI-powered Learning Management System

Nền tảng đào tạo QA với AI: tự động tạo curriculum, tracking tiến độ realtime, nộp bài tập, chấm điểm.

## Tech stack
- **Frontend + Backend**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **AI**: Anthropic Claude API
- **Deploy**: Vercel

## Setup (5 bước)

### 1. Clone & install
```bash
git clone https://github.com/YOUR_USERNAME/qa-lms.git
cd qa-lms
npm install
```

### 2. Tạo Supabase project
1. Vào [supabase.com](https://supabase.com) → New project
2. Vào SQL Editor → paste nội dung file `supabase-schema.sql` → Run
3. Vào Settings → API → copy `Project URL` và `anon key`

### 3. Tạo file `.env.local`
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
ANTHROPIC_API_KEY=sk-ant-...
```

### 4. Lấy Anthropic API key
Vào [console.anthropic.com](https://console.anthropic.com) → API Keys → Create key

### 5. Chạy local
```bash
npm run dev
# Mở http://localhost:3000
# Login: admin / admin123
```

## Deploy lên Vercel
```bash
npm i -g vercel
vercel
# Thêm 3 env vars ở bước 3 vào Vercel dashboard
```

## Tài khoản mặc định
- Admin: `admin` / `admin123`
- Học viên: tạo trong admin dashboard

## Cấu trúc thư mục
```
src/app/
  page.tsx          # Login
  admin/page.tsx    # Admin dashboard
  learn/page.tsx    # Learner portal
  create/page.tsx   # Tạo khoá học
  api/
    auth/           # Đăng nhập
    generate-course/ # AI generate curriculum
    ai-feedback/    # AI chấm bài sơ bộ
    progress/       # Tracking tiến độ
    submissions/    # Nộp & chấm bài
supabase-schema.sql # Tạo database
```
