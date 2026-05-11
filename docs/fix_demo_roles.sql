-- =============================================================
-- FIX DEMO ACCOUNT ROLES
-- Run this in your Supabase SQL Editor if partner demo accounts
-- are being treated as guests (Training/Innovation blocked).
--
-- Cause: Accounts created via Supabase Auth dashboard without
--        setting raw_user_meta_data end up with role='guest'
--        (the default) even for partner accounts.
-- =============================================================

-- 1. VERIFY current roles for all demo accounts
SELECT 
  au.email,
  p.role,
  p.full_name
FROM auth.users au
LEFT JOIN public.profiles p ON p.id = au.id
WHERE au.email IN (
  'p1@demo.com','p2@demo.com','p3@demo.com','p4@demo.com',
  'g1@demo.com','g2@demo.com','g3@demo.com','g4@demo.com',
  'admin@explorablebyo.com'
)
ORDER BY au.email;

-- 2. FIX partner accounts — set role = 'partner'
UPDATE public.profiles
SET role = 'partner'
WHERE id IN (
  SELECT id FROM auth.users
  WHERE email IN ('p1@demo.com','p2@demo.com','p3@demo.com','p4@demo.com')
);

-- 3. FIX guest accounts — set role = 'guest' (should already be correct, but just in case)
UPDATE public.profiles
SET role = 'guest'
WHERE id IN (
  SELECT id FROM auth.users
  WHERE email IN ('g1@demo.com','g2@demo.com','g3@demo.com','g4@demo.com')
);

-- 4. FIX admin account — set role = 'admin'
UPDATE public.profiles
SET role = 'admin'
WHERE id IN (
  SELECT id FROM auth.users
  WHERE email = 'admin@explorablebyo.com'
);

-- 5. VERIFY again after fix
SELECT 
  au.email,
  p.role,
  p.full_name
FROM auth.users au
LEFT JOIN public.profiles p ON p.id = au.id
WHERE au.email IN (
  'p1@demo.com','p2@demo.com','p3@demo.com','p4@demo.com',
  'g1@demo.com','g2@demo.com','g3@demo.com','g4@demo.com',
  'admin@explorablebyo.com'
)
ORDER BY au.email;

-- Expected after fix:
--   admin@explorablebyo.com  | admin
--   g1@demo.com              | guest
--   g2@demo.com              | guest
--   g3@demo.com              | guest
--   g4@demo.com              | guest
--   p1@demo.com              | partner
--   p2@demo.com              | partner
--   p3@demo.com              | partner
--   p4@demo.com              | partner
