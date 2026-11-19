# BUBT Result Portal — Intake 64, Section 4

A responsive Next.js prototype for a student result portal. It currently uses **fictional demo records only**.

## Run locally

1. Install Node.js 20.9+.
2. In this folder, run `npm install`.
3. Run `npm run dev`.
4. Open http://localhost:3000.

Demo IDs: `64-0001` and `64-0002`.

## Deploy to Vercel

1. Create a GitHub repository and upload the contents of this folder.
2. Sign in to Vercel with GitHub and choose **Add New → Project**.
3. Import the repository. Keep the framework preset as Next.js.
4. Click **Deploy**. Vercel will provide a `*.vercel.app` address.

## Before using real student records

- Obtain permission to use BUBT's name/logo and publish academic information.
- Replace `data/results.js` with a database-backed server implementation.
- Configure Supabase using `supabase/schema.sql` as a starting schema.
- Implement verified student authentication or another approved privacy mechanism. **Student ID alone is not authentication**; anyone who knows or guesses an ID could access a result if the lookup is public.
- Enable and test Row Level Security policies. Do not expose a Supabase service-role key in browser code.
- Add an authorized admin workflow, audit logs, backups, and a process for correcting marks.
- Do not upload real student data to this demo as-is.

## Project structure

- `app/page.jsx` — portal interface and demo lookup
- `app/globals.css` — responsive visual design
- `app/layout.jsx` — page metadata and root layout
- `data/results.js` — fictional demo records
- `supabase/schema.sql` — starting database schema (no public read policies)
