export default interface Config {
  dev: boolean;

  // head
  supabaseUrl: string;
  supabaseAnonKey: string;

  webServerUrl: string;
  backendUrl: string;
  backendKey: string;

  walletConnectProjectId: string;
  infuraKey: string;
}
