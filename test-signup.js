require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const accounts = [
  { email: 'p1@demo.com', password: 'password123', meta: { full_name: 'Rob (Partner)', role: 'partner' } },
  { email: 'p2@demo.com', password: 'password123', meta: { full_name: 'Sarah (Partner)', role: 'partner' } },
  { email: 'p3@demo.com', password: 'password123', meta: { full_name: 'David (Partner)', role: 'partner' } },
  { email: 'p4@demo.com', password: 'password123', meta: { full_name: 'Elena (Partner)', role: 'partner' } },
  { email: 'g1@demo.com', password: 'password123', meta: { full_name: 'Alice (Guest)', role: 'guest' } },
  { email: 'g2@demo.com', password: 'password123', meta: { full_name: 'Bob (Guest)', role: 'guest' } },
  { email: 'g3@demo.com', password: 'password123', meta: { full_name: 'Charlie (Guest)', role: 'guest' } },
  { email: 'g4@demo.com', password: 'password123', meta: { full_name: 'Diana (Guest)', role: 'guest' } },
];

async function seedAuth() {
  console.log('Attempting to create 8 legal auth accounts via the API...');
  
  for (const account of accounts) {
    const { data, error } = await supabase.auth.signUp({
      email: account.email,
      password: account.password,
      options: {
        data: account.meta
      }
    });

    if (error) {
      console.error(`Failed to register ${account.email}:`, error.message);
    } else {
      console.log(`Registered ${account.email} -> ID: ${data.user.id}`);
    }
    
    // Slight delay to be gentle on the rate limits if any
    await new Promise(r => setTimeout(r, 500));
  }
}

seedAuth();
