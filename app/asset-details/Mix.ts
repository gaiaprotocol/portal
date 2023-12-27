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
    throw new Error("Not implemented");
  },

  send: async (chain, wallet, toChain, receiver, amounts) => {
    const toChainId = Blockchains[toChain]?.chainId;
    if (toChainId) {
      return await new MixSenderContract(chain, wallet).sendOverHorizon(
        toChainId,
        receiver,
        amounts[0],
      );
    }
  },

  receive: async (chain, wallet, fromChain, sender, sendingId, amounts) => {
    const fromChainId = Blockchains[fromChain]?.chainId;
    const toChainId = Blockchains[chain]?.chainId;
    if (fromChainId && toChainId) {
      const signature = ""; //TODO: implement
      await new MixSenderContract(chain, wallet).receiveOverHorizon(
        fromChainId,
        toChainId,
        sender,
        sendingId,
        amounts[0],
        signature,
      );
    }
  },
};

export default Mix;
