import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { env } from "process";

dotenv.config();

const supabaseUrl = env.SUPABASE_URL;
const supabaseKey = env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('This variables SUPABASE_URL and SUPABASE_ANON_KEY must be defined.');
};

export const supabase = createClient(supabaseUrl, supabaseKey);