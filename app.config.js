import "dotenv/config";

export default {
  expo: {
    name: "BlueMusic",
    slug: "BlueMusic",
    version: "1.0.0",
    scheme: "myapp",
    extra: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    },
  },
};
