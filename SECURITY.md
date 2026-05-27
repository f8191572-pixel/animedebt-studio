# Security Notes

## What is safe in the browser

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

The Supabase anon key is intended for browser usage when RLS is enabled.

## What must stay server-only

- `SUPABASE_SERVICE_ROLE_KEY`
- `GEMINI_API_KEY`

These must only be stored in Vercel Environment Variables.

## RLS

The `projects` table has RLS policies so users can only select, insert, update, and delete their own rows.

## BYOK

If a user pastes their own Gemini key, it is sent to `/api/generate` for that request only.
It is not stored in Supabase.
It is not saved in project data.
