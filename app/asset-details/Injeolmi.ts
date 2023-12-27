import AssetInfo from "../asset/AssetInfo.js";
import AssetType from "../asset/AssetType.js";
import BlockchainType from "../blockchain/BlockchainType.js";
import Blockchains from "../blockchain/Blockchains.js";
import InjeolmiSenderContract from "../contracts/InjeolmiSenderContract.js";
import Erc20Contract from "../contracts/standard/Erc20Contract.js";

const Injeolmi: AssetInfo = {
  type: AssetType.ERC20,
  name: "Injeolmi",
  symbol: "IJM",
  decimals: 18,
  logo: "/images/asset-logos/injeolmi.png",

  addresses: {
    [BlockchainType.Klaytn]: "0x0268dbed3832b87582B1FA508aCF5958cbb1cd74",
    [BlockchainType.Ethereum]: "0xBeA76c71929788Ab20e17759eaC115798F9aEf27",
    [BlockchainType.Polygon]: "0x9b23804ede399ebf86612b560Ac0451f1448185a",
    [BlockchainType.BNB]: "0xf258F061aE2D68d023eA6e7Cceef97962785c6c1",
  },
  senderAddresses: {
    [BlockchainType.Klaytn]: "0x19f112c05Fad52e5C58E5A4628548aBB45bc8697",
    [BlockchainType.Ethereum]: "0xBeA76c71929788Ab20e17759eaC115798F9aEf27",
    [BlockchainType.Polygon]: "0x9b23804ede399ebf86612b560Ac0451f1448185a",
    [BlockchainType.BNB]: "0xf258F061aE2D68d023eA6e7Cceef97962785c6c1",
  },

  fetchBalance: async (chain, wallet) => {
    const walletAddress = await wallet.getAddress();
    if (!walletAddress) return 0n;

    return await new Erc20Contract(
      chain,
      Injeolmi.addresses[chain],
      wallet,
    ).balanceOf(walletAddress);
  },

  fetchTokens: async (chain, wallet) => {
    const balance = await Injeolmi.fetchBalance(chain, wallet);
    return [{ id: 0n, amount: balance }];
  },

  checkApprovalToSender: async (chain, wallet, amounts) => {
    if (!Injeolmi.senderAddresses[chain]) return false;
    if (Injeolmi.senderAddresses[chain] === Injeolmi.addresses[chain]) {
      return true;
    }

    const walletAddress = await wallet.getAddress();
    if (!walletAddress) return false;

    return await new Erc20Contract(
      chain,
      Injeolmi.addresses[chain],
      wallet,
    ).allowance(walletAddress, Injeolmi.senderAddresses[chain]) >= amounts[0];
  },

  approveToSender: async (chain, wallet, amounts) => {
    await new Erc20Contract(
      chain,
      Injeolmi.addresses[chain],
      wallet,
    ).approve(Injeolmi.senderAddresses[chain], amounts[0]);
  },

  send: async (chain, wallet, toChain, receiver, amounts) => {
    const toChainId = Blockchains[toChain]?.chainId;
    if (toChainId) {
      return await new InjeolmiSenderContract(chain, wallet).sendOverHorizon(
        toChainId,
        receiver,
        amounts[0],
      );
    }
  },

  receive: async (chain, wallet, fromChain, sender, sendingId, amounts) => {
    const fromChainId = Blockchains[fromChain]?.chainId;
    if (fromChainId) {
      const signature = ""; //TODO: implement
      await new InjeolmiSenderContract(chain, wallet).receiveOverHorizon(
        fromChainId,
        sender,
        sendingId,
        amounts[0],
        signature,
      );
    }
  },
};

export default Injeolmi;
