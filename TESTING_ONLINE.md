# Online Testing Checklist

Use this after Vercel deploys.

## Auth

- [ ] Sign up works
- [ ] Sign in works
- [ ] Sign out works

## Generation

- [ ] Load demo works
- [ ] Generate with backend works
- [ ] Prompt tab shows generated prompt
- [ ] JSON tab shows metadata

## Supabase Storage

- [ ] Save to Supabase works
- [ ] Project appears in saved library
- [ ] Load project works
- [ ] Delete project works
- [ ] Refresh page and saved projects still appear

## Security

- [ ] `.env` is not in GitHub
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is only in Vercel
- [ ] `GEMINI_API_KEY` is only in Vercel
- [ ] RLS is enabled on `projects`
