/**
 * Ensures required env vars exist so Prisma/NextAuth don't crash during
 * `next build` or when Vercel preview omits optional secrets.
 * Production must still set real values in the Vercel dashboard.
 */
const DUMMY_DB =
  "postgresql://postgres:postgres@127.0.0.1:5432/postgres?schema=public";
const DUMMY_SECRET =
  "build-time-placeholder-nextauth-secret-min-32-chars-required";

function ensureEnv() {
  if (!process.env.DATABASE_URL?.trim()) {
    process.env.DATABASE_URL = DUMMY_DB;
  }
  if (!process.env.NEXTAUTH_SECRET?.trim()) {
    process.env.NEXTAUTH_SECRET = DUMMY_SECRET;
  }
  if (!process.env.NEXTAUTH_URL?.trim()) {
    process.env.NEXTAUTH_URL = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";
  }
  if (process.env.OPENAI_API_KEY === undefined || process.env.OPENAI_API_KEY === null) {
    process.env.OPENAI_API_KEY = "";
  }
  /* UI preview: skip login/JWT — set DISABLE_AUTH=false to re-enable auth */
  if (process.env.DISABLE_AUTH === undefined || process.env.DISABLE_AUTH === "") {
    process.env.DISABLE_AUTH = "true";
  }
  if (process.env.NEXT_PUBLIC_DISABLE_AUTH === undefined || process.env.NEXT_PUBLIC_DISABLE_AUTH === "") {
    process.env.NEXT_PUBLIC_DISABLE_AUTH = process.env.DISABLE_AUTH;
  }
}

ensureEnv();
