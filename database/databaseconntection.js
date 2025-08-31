import { createClient } from '@supabase/supabase-js';

// Hardcoded Supabase credentials
const SUPABASE_URL = "https://fcwajthkxusymctcsmhx.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjd2FqdGhreHVzeW1jdGNzbWh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzODM5MjcsImV4cCI6MjA3MTk1OTkyN30.oiV4bssiOZYoQMtVH374urvK4-KUvfQhCg1prSk0E7g";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);



export default supabase;