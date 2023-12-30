import { Interface, InterfaceAbi, JsonRpcSigner } from "ethers";
import BlockchainType from "../blockchain/BlockchainType.js";

export default interface WalletManager {
  getAddress(): Promise<string | undefined>;
  getBalance(chain: BlockchainType): Promise<bigint | undefined>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getSigner(chain: BlockchainType): Promise<JsonRpcSigner | undefined>;
  writeManual?(
    address: string,
    abi: Interface | InterfaceAbi,
    run: {
      method: string;
      params?: any[];
      value?: bigint;
    },
  ): Promise<void>;
}
