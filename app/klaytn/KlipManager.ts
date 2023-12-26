import { EventContainer } from "common-app-module";
import WalletManager from "../wallet/WalletManager.js";

class KlipManager extends EventContainer implements WalletManager {
}

export default new KlipManager();
