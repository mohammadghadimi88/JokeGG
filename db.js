// Supabase Database Connection Module
const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_KEY = "YOUR_SUPABASE_ANON_KEY";

const db = (window.supabase) ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

// Abstracted Database Functions (Modular Architecture)
const DB = {
  async getPosts() {
    if(!db) return [];
    let { data, error } = await db.from('posts').select('*').order('created_at', { ascending: false });
    return error ? [] : data;
  },
  
  async createPost(text, userHandle) {
    if(!db) return null;
    let { data, error } = await db.from('posts').insert([{ text, user_handle: userHandle, buyers: [] }]);
    return error ? null : data;
  },

  async buyJoke(postId, buyerHandle) {
    // Add logic to record buy and increase creator 50% balance
  },

  async submitTx(userHandle, txHash, amount) {
    if(!db) return;
    await db.from('transactions').insert([{ user_handle: userHandle, tx_hash: txHash, amount, status: 'pending' }]);
  }
};