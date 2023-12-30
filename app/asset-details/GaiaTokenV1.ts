import { ethers } from "ethers";
import TrinityManager from "../TrinityManager.js";
import AssetInfo from "../asset/AssetInfo.js";
import AssetType from "../asset/AssetType.js";
import BlockchainType from "../blockchain/BlockchainType.js";
import Blockchains from "../blockchain/Blockchains.js";
import GaiaBridgeContract, {
  addresses as GaiaBridgeAddresses,
  TokenType,
} from "../contracts/GaiaBridgeContract.js";
import Erc20Contract from "../contracts/standard/Erc20Contract.js";

const TOKEN_NAME = "gaiatoken";

const GaiaTokenV1: AssetInfo = {
  type: AssetType.ERC20,
  name: "GaiaToken V1",
  symbol: "GAIA",
  logo: "/images/asset-logos/gaia.png",
  addresses: {
    [BlockchainType.Ethereum]: "0xeACB1E79425236dAcd5Df3D0bd3F73e3dc6fb11e",
    [BlockchainType.Bifrost]: "0x89ef657f8c32197D7852f4Bb410e87afEfcb6B59",
    [BlockchainType.Klaytn]: "0x172369962Cb722611319932e5E5585dECbDAeC0f",
  },
  senderAddresses: GaiaBridgeAddresses,

  fetchBalance: async (chain, wallet) => {
    const walletAddress = await wallet.getAddress();
    if (!walletAddress) return 0n;

    return await new Erc20Contract(
      chain,
      GaiaTokenV1.addresses[chain],
      wallet,
    ).balanceOf(walletAddress);
  },

  fetchTokens: async (chain, wallet) => {
    const balance = await GaiaTokenV1.fetchBalance(chain, wallet);
    return [{ id: 0n, amount: balance }];
  },

  checkApprovalToSender: async (chain, wallet, amounts) => {
    if (!GaiaTokenV1.senderAddresses[chain]) return false;
    if (GaiaTokenV1.senderAddresses[chain] === GaiaTokenV1.addresses[chain]) {
      return true;
    }

    const walletAddress = await wallet.getAddress();
    if (!walletAddress) return false;

    return await new Erc20Contract(
      chain,
      GaiaTokenV1.addresses[chain],
      wallet,
    ).allowance(walletAddress, GaiaTokenV1.senderAddresses[chain]) >=
      amounts[0];
  },

  approveToSender: async (chain, wallet, amounts) => {
    await new Erc20Contract(
      chain,
      GaiaTokenV1.addresses[chain],
      wallet,
    ).approve(GaiaTokenV1.senderAddresses[chain], amounts[0]);
  },

  send: async (chain, wallet, toChain, receiver, amounts) => {
    const toChainId = Blockchains[toChain]?.chainId;
    if (toChainId) {
      const sendingId = await new GaiaBridgeContract(chain, wallet).sendTokens(
        toChainId,
        receiver,
        {
          tokenType: TokenType.ERC20,
          tokenName: TOKEN_NAME,
          tokenAddress: GaiaTokenV1.addresses[chain],
          ids: Object.keys(amounts).map((id) => BigInt(id)),
          amounts: Object.values(amounts),
        },
        "0x",
        [],
      );
      await TrinityManager.trackEvent(chain, 0);
      return sendingId;
    }
  },

  receive: async (chain, wallet, fromChain, sender, sendingId, amounts) => {
    const fromChainId = Blockchains[fromChain]?.chainId;
    const toChainId = Blockchains[chain]?.chainId;
    const walletAddress = await wallet.getAddress();

    if (fromChainId && toChainId && walletAddress) {
      const results: {
        address: string;
        signature: { r: string; _vs: string };
      }[] = [];

      const dataSet = await TrinityManager.sign(
        TOKEN_NAME,
        fromChainId,
        sender,
        Number(sendingId),
        toChainId,
        walletAddress,
      );

      for (const data of dataSet) {
        const sSig = ethers.Signature.from(data.signature);
        results.push({
          address: data.address,
          signature: { r: sSig.r, _vs: sSig.yParityAndS },
        });
      }

      results.sort((
        a,
        b,
      ) => (BigInt(a.address) < BigInt(b.address) ? -1 : 1));

      await new GaiaBridgeContract(chain, wallet).receiveTokens(
        sender,
        fromChainId,
        walletAddress,
        {
          tokenType: TokenType.ERC20,
          tokenName: TOKEN_NAME,
          tokenAddress: GaiaTokenV1.addresses[chain],
          ids: Object.keys(amounts).map((id) => BigInt(id)),
          amounts: Object.values(amounts),
        },
        sendingId,
        "0x",
        results.map((result) => result.signature),
      );

      await TrinityManager.trackEvent(chain, 0);
    }
  },
};

export default GaiaTokenV1;
