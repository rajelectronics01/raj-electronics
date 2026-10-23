/*
  RAJ ELECTRONICS: SUPABASE RLS LOCKDOWN
  Run in Supabase Dashboard -> SQL Editor. Safe to re-run.

  The app never reads tables through the Supabase REST API (anon/publishable
  key). All DB access goes through Prisma using the `postgres` role (DATABASE_URL),
  which owns the tables and therefore bypasses RLS. So we enable RLS with NO
  policies (= deny everything for anon/authenticated) and revoke their grants.
  Fixes Supabase advisors: rls_disabled_in_public, sensitive_columns_exposed.
*/

-- 1. Enable RLS on every table in the public schema (incl. _prisma_migrations)
DO $$
DECLARE t record;
BEGIN
  FOR t IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t.tablename);
  END LOOP;
END $$;

-- 2. Drop old policies from the previous version of this script (they relied on
--    Supabase Auth phone JWTs, which this app doesn't use, and the "User" policy
--    was self-referential).
DROP POLICY IF EXISTS "Users can only see their own profile"     ON "User";
DROP POLICY IF EXISTS "Users can update their own profile"       ON "User";
DROP POLICY IF EXISTS "Users can only see their own orders"      ON "Order";
DROP POLICY IF EXISTS "Users can manage their own addresses"     ON "Address";
DROP POLICY IF EXISTS "Users can see items of their own orders"  ON "OrderItem";

-- 3. Belt and braces: remove API roles' privileges on existing and future objects
REVOKE ALL ON ALL TABLES    IN SCHEMA public FROM anon, authenticated;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon, authenticated;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE ALL ON TABLES    FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE ALL ON SEQUENCES FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE ALL ON FUNCTIONS FROM anon, authenticated;

-- 4. Verify: every row should show rls_enabled = true
SELECT tablename, rowsecurity AS rls_enabled
FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
