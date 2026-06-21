const SB_URL = 'https://wkszqhzlblzylxnqzmhu.supabase.co';
const SB_KEY = 'sb_publishable_QI3lduy_Q650aSD4s5gFKQ_aO1tTK-o';

const sb = window.supabase.createClient(SB_URL, SB_KEY);

// Replace the REST client's fetch so every request carries the real user JWT.
// The UMD build's internal fetch wrapper falls back to the anon key when
// getSession() returns null (timing issue), which makes RLS reject with 403.
//
// Our wrapper runs FIRST — it injects the real token into the request headers.
// Then the UMD wrapper runs and sees Authorization already set, so it skips.
{
  const _restFetch = sb.rest.fetch;

  async function supabaseFetch(url, opts) {
    try {
      const { data: { session } } = await sb.auth.getSession();
      opts = opts || {};
      opts.headers = opts.headers ? { ...opts.headers } : {};
      opts.headers['apikey'] = SB_KEY;
      opts.headers['Authorization'] = session?.access_token
        ? `Bearer ${session.access_token}`
        : `Bearer ${SB_KEY}`;
    } catch {
      // If getSession fails (e.g. network error during token refresh),
      // continue with whatever headers are already set.
    }
    return _restFetch.call(this, url, opts);
  }

  sb.rest.fetch = supabaseFetch;
}
