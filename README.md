# AnimeDebt Studio — Vercel + Supabase Version

Updated: 2026-05-27 17:01

This is the corrected production-style architecture: 

```txt
Vercel
├── Next.js frontend
└── /api/generate Vercel Function backend
    └── calls Gemini API using server env variable

Supabase
├── Auth users
├── profiles table
└── projects table with RLS policies
```

## Where everything is stored

### User accounts
Stored in Supabase Auth.

### User profile rows
Stored in `public.profiles`.

### User projects and outputs
Stored in `public.projects`.

### Gemini API key
Stored in Vercel Environment Variables as `GEMINI_API_KEY`.

### Optional user-provided Gemini key
Used only for one backend request and not stored.

## Deploy without local testing

1. Create Supabase project.
2. Run `supabase/schema.sql` in Supabase SQL Editor.
3. Create GitHub repo and upload this project.
4. Import repo into Vercel.
5. Add environment variables in Vercel.
6. Deploy.

## Vercel Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GEMINI_API_KEY=
ALLOW_ANON_GENERATION=false
```

Do not put `.env` in GitHub.

## Important

This version uses Supabase RLS, so each user can only access their own projects.
