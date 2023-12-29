import { el, View } from "common-app-module";
import GlobalActivityList from "../activity/GlobalActivityList.js";
import Layout from "../layout/Layout.js";

export default class HistoryView extends View {
  constructor() {
    super();
    Layout.append(
      this.container = el(
        ".history-view",
        new GlobalActivityList(),
      ),
    );
  }
}
