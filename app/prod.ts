import initialize from "./initialize.js";
await initialize({
  dev: true,

  supabaseUrl: "https://khvffojovxmdgyqdnqby.supabase.co",
  supabaseAnonKey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtodmZmb2pvdnhtZGd5cWRucWJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDM2ODM1NDgsImV4cCI6MjAxOTI1OTU0OH0._vHsm1ARW9WdJSg-Fh6rWANxJ1xedlXdc70bqXatWEg",

  webServerUrl: "https://gaia.cc",
  backendUrl: "https://qlusufpskzfuzakfzyuj.supabase.co",
  backendKey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsdXN1ZnBza3pmdXpha2Z6eXVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTEwNTEzNDQsImV4cCI6MjAwNjYyNzM0NH0.PU-d9F-sjJ5KPcY-zl_iXaHesb00-Y5O26c9h_7mmAs",

  walletConnectProjectId: "0ab785b21622796d65bc8114214f4cb8",
  infuraKey: "61f85925d0204a4da353c23bc0d90182",
});
