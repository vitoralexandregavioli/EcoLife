// Use a URL do projeto e a chave publicável/anon disponíveis em
// Supabase > Project Settings > API. Nunca coloque a service_role no front-end.
const SUPABASE_URL = 'https://nyssjrkhitzgjpkszqfk.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_r6tf8LtF6iVOT5GQ3Zl7UA_oNYmC_zl';

// A biblioteca deve ser carregada por CDN antes deste arquivo.
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
