export default interface Config {
  dev: boolean;

  // head
  supabaseUrl: string;
  supabaseAnonKey: string;

  aosServerUrl: string;
  backendUrl: string;
  backendKey: string;

  walletConnectProjectId: string;
  infuraKey: string;
}
