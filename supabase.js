const SUPABASE_URL = "https://ygoigynjhoifdanopulz.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlnb2lneW5qaG9pZmRhbm9wdWx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1NTYwNzIsImV4cCI6MjA4MzEzMjA3Mn0.7kF9ryqRM3b55eggF7UrB3j9TD7-8azsCPpC1wI_fwA";

window.supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);
