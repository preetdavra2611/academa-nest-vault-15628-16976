-- Grant admin role to the user
UPDATE public.profiles 
SET role = 'admin'
WHERE email = 'preetdavra2611@gmail.com';