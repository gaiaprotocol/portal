import { Supabase } from "@common-module/app";
import TrinityManager from "../TrinityManager.js";
import AssetInfo from "../asset/AssetInfo.js";
import AssetType from "../asset/AssetType.js";
import BlockchainType from "../blockchain/BlockchainType.js";
import Blockchains from "../blockchain/Blockchains.js";
import MixSenderContract from "../contracts/MixSenderContract.js";
import Erc20Contract from "../contracts/standard/Erc20Contract.js";

const Mix: AssetInfo = {
  type: AssetType.ERC20,
  name: "DSC Mix",
  symbol: "MIX",
  decimals: 18,
  logo: "/images/asset-logos/mix.png",

  addresses: {
    [BlockchainType.Klaytn]: "0xDd483a970a7A7FeF2B223C3510fAc852799a88BF",
    [BlockchainType.Ethereum]: "0x5DB69B9f173f9D9FA91b7cDCc4Dc9939C0499CFe",
    [BlockchainType.Polygon]: "0x5085a6879Af6767732c51CA0fc7422d41d9aAEf6",
  },
  senderAddresses: {
    [BlockchainType.Klaytn]: "0xDeE2b8539c2321450a99f6728633DEf8d069262F",
    [BlockchainType.Ethereum]: "0x5DB69B9f173f9D9FA91b7cDCc4Dc9939C0499CFe",
    [BlockchainType.Polygon]: "0x5085a6879Af6767732c51CA0fc7422d41d9aAEf6",
  },

  fetchBalance: async (chain, wallet) => {
    const walletAddress = await wallet.getAddress();
    if (!walletAddress) return 0n;

    return await new Erc20Contract(
      chain,
      Mix.addresses[chain],
      wallet,
    ).balanceOf(walletAddress);
  },

  fetchTokens: async (chain, wallet) => {
    const balance = await Mix.fetchBalance(chain, wallet);
    return [{ id: 0n, amount: balance }];
  },

  checkApprovalToSender: async (chain, wallet, amounts) => {
    if (!Mix.senderAddresses[chain]) return false;
    if (Mix.senderAddresses[chain] === Mix.addresses[chain]) {
      return true;
    }

    const walletAddress = await wallet.getAddress();
    if (!walletAddress) return false;

    return await new Erc20Contract(
      chain,
      Mix.addresses[chain],
      wallet,
    ).allowance(walletAddress, Mix.senderAddresses[chain]) >= amounts[0];
  },

  approveToSender: async (chain, wallet, amounts) => {
    await new Erc20Contract(
      chain,
      Mix.addresses[chain],
      wallet,
    ).approve(Mix.senderAddresses[chain], amounts[0]);
  },

  send: async (chain, wallet, toChain, receiver, amounts) => {
    const toChainId = Blockchains[toChain]?.chainId;
    if (toChainId) {
      // check trackable
      await TrinityManager.trackEvent(chain, 2);

      const sendingId = await new MixSenderContract(chain, wallet)
        .sendOverHorizon(
          toChainId,
          receiver,
          amounts[0],
        );
      await TrinityManager.trackEvent(chain, 2);
      return sendingId;
    }
  },

  receive: async (chain, wallet, fromChain, sender, sendingId, amounts) => {
    const walletAddress = await wallet.getAddress();
    if (!walletAddress) throw new Error("No wallet address");

    const fromChainId = Blockchains[fromChain]?.chainId;
    const toChainId = Blockchains[chain]?.chainId;
    if (fromChainId && toChainId) {
      const { data, error } = await Supabase.client.functions.invoke(
        "sign-portal-send",
        {
          body: {
            "asset": "mix",
            "fromChainId": fromChainId,
            "sender": sender,
            "sendingId": Number(sendingId),
            "toChainId": toChainId,
            "receiver": walletAddress,
          },
        },
      );
      if (error) throw error;
      await new MixSenderContract(chain, wallet).receiveOverHorizon(
        fromChainId,
        toChainId,
        sender,
        sendingId,
        amounts[0],
        data.signature,
      );
      await TrinityManager.trackEvent(chain, 2);
    }
  },
};

export default Mix;
