import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://crxjtyccahkakhgyuuez.supabase.co'; // Ej: [https://xyz.supabase.co](https://xyz.supabase.co)
const supabaseKey = 'sb_publishable_PRyoZ4IEdbJn1iv-7WAowg_hdVFLBeg';

export const supabase = createClient(supabaseUrl, supabaseKey);
