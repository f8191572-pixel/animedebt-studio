# Deploy AnimeDebt Studio to Vercel + Supabase

## 1. Supabase setup

1. Go to Supabase.
2. Create a new project.
3. Open SQL Editor.
4. Paste everything from `supabase/schema.sql`.
5. Run it.

This creates:

- `profiles`
- `projects`
- RLS policies
- auth trigger for profile creation

## 2. Get Supabase keys

In Supabase:

1. Project Settings
2. API
3. Copy:
   - Project URL
   - anon public key
   - service_role key

The anon key goes to the browser.
The service role key only goes to Vercel environment variables.

## 3. GitHub

1. Create a GitHub repo.
2. Upload all files from this project.
3. Do not upload `.env`.

## 4. Vercel

1. Go to Vercel.
2. Add New Project.
3. Import your GitHub repo.
4. Framework should detect Next.js.
5. Add environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
GEMINI_API_KEY=YOUR_GEMINI_KEY
ALLOW_ANON_GENERATION=false
```

6. Click Deploy.

## 5. Test online

1. Open the Vercel URL.
2. Sign up.
3. Sign in.
4. Load demo.
5. Generate with backend.
6. Save to Supabase.
7. Refresh page.
8. Check if project loads from Supabase.

## Notes

This setup does not require local testing.
