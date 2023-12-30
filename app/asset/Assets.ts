import GaiaTokenV1 from "../asset-details/GaiaTokenV1.js";
import Injeolmi from "../asset-details/Injeolmi.js";
import KlaydiceSpecialDice from "../asset-details/KlaydiceSpecialDice.js";
import Mix from "../asset-details/Mix.js";
import AssetInfo from "./AssetInfo.js";

const Assets: { [id: string]: AssetInfo } = {
  ["klaydice-special-dice-nft"]: KlaydiceSpecialDice,
  mix: Mix,
  ijm: Injeolmi,
  //gaiatoken: GaiaTokenV1,
};

export default Assets;
