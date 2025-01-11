import {
  BodyNode,
  DomNode,
  el,
  MaterialIcon,
  msg,
  NavBar,
  View,
  ViewParams,
} from "@common-module/app";
import TitleBar from "./TitleBar.js";
import Assets from "../asset/Assets.js";

export default class Layout extends View {
  private static _current: Layout;

  public static append(node: DomNode): void {
    Layout._current.content.append(node);
  }

  private navBar: NavBar;
  private titleBar: TitleBar;
  private content: DomNode;

  constructor(params: ViewParams, uri: string) {
    super();
    Layout._current = this;

    BodyNode.append(
      this.container = el(
        ".layout",
        this.navBar = new NavBar({
          logo: el("img", { src: "/images/logo-transparent.png" }),
          menu: [
            {
              id: "bridge",
              icon: new MaterialIcon("swap_horiz"),
              title: msg("nav-bar-menu-bridge"),
              uri: "/",
            },
            {
              id: "history",
              icon: new MaterialIcon("history"),
              title: msg("nav-bar-menu-history"),
              uri: "/history",
            },
          ],
        }),
        el(
          "main",
          this.titleBar = new TitleBar(),
          this.content = el("section.content"),
        ),
      ),
    );

    this.changeUri(uri);
  }

  public changeParams(params: ViewParams, uri: string): void {
    this.changeUri(uri);
  }

  private changeUri(uri: string): void {
    if (uri.substring(0, 7) === "history") uri = "history";
    else if (Assets[uri] || Assets[uri.substring(0, uri.indexOf("/"))]) {
      uri = "";
    }
    this.navBar.active(
      uri === "" ? "bridge" : uri.substring(
        0,
        uri.indexOf("/") === -1 ? uri.length : uri.indexOf("/"),
      ),
    );
    this.titleBar.changeTitle(uri);
  }
}
