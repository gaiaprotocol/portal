import { ethers } from "ethers";
import TrinityManager from "../TrinityManager.js";
import AssetInfo, { AssetMetadata } from "../asset/AssetInfo.js";
import AssetType from "../asset/AssetType.js";
import BlockchainType from "../blockchain/BlockchainType.js";
import Blockchains from "../blockchain/Blockchains.js";
import GaiaBridgeContract, {
  addresses as GaiaBridgeAddresses,
  TokenType,
} from "../contracts/GaiaBridgeContract.js";
import NftUtilContract from "../contracts/NftUtilContract.js";
import Erc721Contract from "../contracts/standard/Erc721Contract.js";
import metadata from "./klaydice-special-dice-metadata.json" assert {
  type: "json",
};

const TOKEN_NAME = "klaydice-special-dice-nft";

const KlaydiceSpecialDice: AssetInfo = {
  type: AssetType.ERC721,
  name: "KLAYDICE - Special DICE NFT",
  symbol: "DICE",
  logo:
    "https://public.nftstatic.com/static/nft/webp/4721d0eadafc4b2e9c8ba869fb08db6d_400x400.webp",
  addresses: {
    [BlockchainType.BNB]: "0x1dDB2C0897daF18632662E71fdD2dbDC0eB3a9Ec",
    [BlockchainType.Bifrost]: "0xdf98e88944be3bc7C861135dAc617AD562EBB8D0",
  },
  senderAddresses: GaiaBridgeAddresses,

  fetchBalance: async (chain, wallet) => {
    const walletAddress = await wallet.getAddress();
    if (!walletAddress) return 0n;

    return await new Erc721Contract(
      chain,
      KlaydiceSpecialDice.addresses[chain],
      wallet,
    ).balanceOf(walletAddress);
  },

  fetchTokens: async (chain, wallet) => {
    const walletAddress = await wallet.getAddress();
    if (!walletAddress) return [];

    const tokenIds = await new NftUtilContract(chain, wallet).getTokenIds(
      KlaydiceSpecialDice.addresses[chain],
      walletAddress,
    );

    const result: {
      id: bigint;
      amount: bigint;
      metadata?: AssetMetadata;
    }[] = [];

    for (const id of tokenIds) {
      const m = metadata.find((m) => m.id === Number(id));
      result.push({
        id,
        amount: 1n,
        metadata: m
          ? {
            name: `Special DICE NFT - ${m.n}`,
            image: `https://public.nftstatic.com/static/nft/res/${m.i}.png`,
          }
          : undefined,
      });
    }
    return result;
  },

  checkApprovalToSender: async (chain, wallet, amounts) => {
    if (!KlaydiceSpecialDice.senderAddresses[chain]) return false;

    const walletAddress = await wallet.getAddress();
    if (!walletAddress) return false;

    return await new Erc721Contract(
      chain,
      KlaydiceSpecialDice.addresses[chain],
      wallet,
    ).isApprovedForAll(
      walletAddress,
      KlaydiceSpecialDice.senderAddresses[chain],
    );
  },

  approveToSender: async (chain, wallet, amounts) => {
    await new Erc721Contract(
      chain,
      KlaydiceSpecialDice.addresses[chain],
      wallet,
    ).setApprovalForAll(
      KlaydiceSpecialDice.senderAddresses[chain],
      true,
    );
  },

  send: async (chain, wallet, toChain, receiver, amounts) => {
    const toChainId = Blockchains[toChain]?.chainId;
    if (toChainId) {
      const sendingId = await new GaiaBridgeContract(chain, wallet).sendTokens(
        toChainId,
        receiver,
        {
          tokenType: TokenType.ERC721,
          tokenName: TOKEN_NAME,
          tokenAddress: KlaydiceSpecialDice.addresses[chain],
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
          tokenType: TokenType.ERC721,
          tokenName: TOKEN_NAME,
          tokenAddress: KlaydiceSpecialDice.addresses[chain],
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

export default KlaydiceSpecialDice;
