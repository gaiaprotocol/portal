export default interface KlaytnWalletManager {
  get installed(): boolean;
  getAddress(): Promise<string | undefined>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}
