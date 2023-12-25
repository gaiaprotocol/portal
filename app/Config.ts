export default interface Config {
  dev: boolean;

  supabaseUrl: string;
  supabaseAnonKey: string;

  walletConnectProjectId: string;
  infuraKey: string;

  contracts: {
    [contract: string]: {
      [chain: string]: string;
    };
  };
}
