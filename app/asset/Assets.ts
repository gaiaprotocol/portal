import Injeolmi from "../asset-details/Injeolmi.js";
import KlaydiceSpecialDice from "../asset-details/KlaydiceSpecialDice.js";
import Mix from "../asset-details/Mix.js";
import AssetInfo from "./AssetInfo.js";

const Assets: { [id: string]: AssetInfo } = {
  ijm: Injeolmi,
  mix: Mix,
  ["klaydice-special-dice-nft"]: KlaydiceSpecialDice,
};

export default Assets;
