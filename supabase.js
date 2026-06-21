const sb = window.supabase.createClient(
  'https://wkszqhzlblzylxnqzmhu.supabase.co',
  'sb_publishable_QI3lduy_Q650aSD4s5gFKQ_aO1tTK-o'
);

// Restore session so REST client sends auth header
(async () => {
  const { data: { session } } = await sb.auth.getSession();
  if (session) await sb.auth.setSession({ access_token: session.access_token, refresh_token: session.refresh_token });
})();
