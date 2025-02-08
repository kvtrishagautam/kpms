require('dotenv').config();  // Load environment variables
const { createClient } = require('@supabase/supabase-js');

// Use environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
