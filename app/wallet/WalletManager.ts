import { JsonRpcSigner } from "ethers";
import BlockchainType from "../blockchain/BlockchainType.js";

export default interface WalletManager {
  getAddress(): Promise<string | undefined>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getSigner(chain: BlockchainType): Promise<JsonRpcSigner | undefined>;
}
