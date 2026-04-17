import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE
  );

  const { id, username } = req.body;

  await supabase.from('users').upsert({
    id,
    username,
    created_at: new Date()
  });

  res.json({ ok: true });
}
