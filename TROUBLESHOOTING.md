# Troubleshooting Guide

## Common Issues and Solutions

### Database Setup Issues

#### ❌ Error: "null value in column user_id violates not-null constraint"

**Full error:**
```
ERROR: 23502: null value in column "user_id" of relation "room_members" violates not-null constraint
CONTEXT: SQL statement "INSERT INTO public.room_members (room_id, user_id, role)..."
PL/pgSQL function add_room_creator_as_owner() line 3 at SQL statement
```

**Cause**: The trigger was trying to add a user to a room when `created_by` was NULL (for the General room).

**Solution**: ✅ This is fixed in the latest `supabase-schema.sql`. The trigger now checks if `created_by` is not NULL before inserting.

**Steps to fix:**
1. Use the updated `supabase-schema.sql` file
2. If you already ran the old version, drop and recreate the function:
   ```sql
   DROP FUNCTION IF EXISTS add_room_creator_as_owner() CASCADE;
   ```
3. Then run the updated schema again

---

#### ❌ Error: "permission denied for table profiles"

**Cause**: Using the wrong API key or RLS policies not set up correctly.

**Solution**:
1. Make sure you're using the `anon` public key, not `service_role`
2. Verify RLS policies were created (check Table Editor > profiles > RLS is enabled)
3. Re-run the schema if needed

---

#### ❌ Error: "relation public.profiles does not exist"

**Cause**: The schema wasn't executed properly.

**Solution**:
1. Go to Supabase SQL Editor
2. Copy the **entire** `supabase-schema.sql` file
3. Paste and run it again
4. Check Table Editor to verify tables exist

---

### Application Issues

#### 🔴 Messages not appearing in chat

**Possible causes:**
1. Not a member of the room
2. Realtime not enabled
3. RLS blocking the query

**Solutions**:
1. Check Database > Replication - enable realtime for `messages` table
2. Check browser console (F12) for errors
3. Verify you're in the room:
   ```sql
   SELECT * FROM room_members WHERE user_id = 'your-user-id';
   ```

---

#### 🔴 "Invalid API credentials" or "Failed to fetch"

**Cause**: Wrong or missing environment variables.

**Solution**:
1. Check `.env.local` exists in project root
2. Verify both variables are set:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
   ```
3. Make sure there are no extra quotes or spaces
4. Restart dev server: `npm run dev`

---

#### 🔴 Can't sign up - "User already registered"

**Cause**: Email already exists in auth.users.

**Solution**:
1. Use a different email
2. Or reset the user in Supabase:
   - Go to Authentication > Users
   - Find and delete the user
   - Try again

---

#### 🔴 Can't sign in - "Invalid login credentials"

**Possible causes:**
1. Wrong email/password
2. Email confirmation required
3. User doesn't exist

**Solutions**:
1. Double-check credentials
2. Disable email confirmation in Auth > Settings (for development)
3. Check Authentication > Users to see if user exists

---

#### 🔴 Typing indicators not showing

**Cause**: Realtime not enabled for `typing_indicators`.

**Solution**:
1. Go to Database > Replication
2. Enable replication for `typing_indicators` table
3. Refresh the app

---

#### 🔴 Emoji picker not appearing

**Cause**: CSS/JavaScript conflict or component not loaded.

**Solution**:
1. Check browser console for errors
2. Verify `emoji-picker-react` is installed: `npm list emoji-picker-react`
3. Reinstall if needed: `npm install emoji-picker-react@^4.7.15`
4. Clear browser cache

---

#### 🔴 Profile not loading after signup

**Cause**: Profile wasn't created or RLS blocking it.

**Solution**:
1. Check if profile exists:
   ```sql
   SELECT * FROM profiles WHERE id = 'user-id';
   ```
2. If missing, manually create:
   ```sql
   INSERT INTO profiles (id, username, display_name)
   VALUES ('user-id', 'username', 'Display Name');
   ```
3. Check RLS policies allow the user to read their own profile

---

### Performance Issues

#### 🐌 Slow message loading

**Solutions**:
1. Check if indexes exist:
   ```sql
   SELECT * FROM pg_indexes WHERE tablename = 'messages';
   ```
2. Limit messages query in code (add LIMIT clause)
3. Implement pagination for large chat histories

---

#### 🐌 App freezing on message send

**Cause**: Real-time subscription causing re-render loops.

**Solution**:
1. Check for duplicate subscriptions in browser console
2. Verify `useEffect` cleanup functions are returning unsubscribe
3. Make sure channel names are unique

---

### Deployment Issues

#### 🚀 Environment variables not working in production

**Solution**:
1. Make sure variables start with `NEXT_PUBLIC_` for client-side access
2. Set environment variables in your hosting platform (Vercel/Netlify)
3. Redeploy after adding variables

---

#### 🚀 Database connection fails in production

**Possible causes:**
1. Wrong Supabase URL
2. Supabase project paused (free tier)
3. CORS issues

**Solutions**:
1. Verify production environment variables
2. Wake up Supabase project (free tier pauses after inactivity)
3. Check Supabase dashboard for any alerts

---

## Debugging Tips

### Enable Supabase Debug Mode

Add this to see detailed logs:

```typescript
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(url, key, {
  auth: {
    debug: true  // Enable auth debugging
  }
})
```

### Check Browser Console

Press F12 and look for:
- Network errors (failed API calls)
- JavaScript errors
- Supabase client logs

### Check Supabase Logs

1. Go to your Supabase project
2. Click "Logs" in the left sidebar
3. Select "Database" or "API" logs
4. Look for errors around the time of the issue

### Test Database Directly

Use Supabase SQL Editor to test queries:

```sql
-- Check if user exists
SELECT * FROM profiles WHERE username = 'testuser';

-- Check room membership
SELECT r.name, rm.role 
FROM room_members rm 
JOIN rooms r ON r.id = rm.room_id 
WHERE rm.user_id = 'user-id';

-- Check recent messages
SELECT m.content, p.username, m.created_at
FROM messages m
JOIN profiles p ON p.id = m.user_id
ORDER BY m.created_at DESC
LIMIT 10;
```

### Reset Everything

If all else fails, reset the database:

```sql
-- WARNING: This deletes ALL data!
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
```

Then re-run the schema from `supabase-schema.sql`.

---

## Getting Help

If you're still stuck:

1. Check the [Supabase Documentation](https://supabase.com/docs)
2. Review the `README.md` for setup instructions
3. Check `FEATURES.md` to understand how features work
4. Look at browser console and Supabase logs for specific errors
5. Open an issue with:
   - Error message
   - Steps to reproduce
   - Screenshots if applicable
   - Browser console logs

---

## Quick Checklist

Before asking for help, verify:

- [ ] Ran the complete `supabase-schema.sql` in SQL Editor
- [ ] All tables exist in Table Editor
- [ ] RLS is enabled on all tables
- [ ] Realtime enabled for: messages, reactions, typing_indicators, profiles
- [ ] `.env.local` file exists with correct credentials
- [ ] Environment variables start with `NEXT_PUBLIC_`
- [ ] Restarted dev server after changing environment variables
- [ ] No errors in browser console (F12)
- [ ] Supabase project is not paused
- [ ] Using the `anon` key, not `service_role`

Most issues are solved by checking these items! ✅
