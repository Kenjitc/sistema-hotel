import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'TU_URL_DE_SUPABASE'; // Ej: [https://xyz.supabase.co](https://xyz.supabase.co)
const supabaseKey = 'TU_ANON_KEY_DE_SUPABASE';

export const supabase = createClient(supabaseUrl, supabaseKey);
