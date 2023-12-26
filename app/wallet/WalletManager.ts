export default interface WalletManager {
  getAddress(): Promise<string | undefined>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}
