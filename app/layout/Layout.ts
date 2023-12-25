import {
  BodyNode,
  DomNode,
  el,
  Icon,
  MaterialIcon,
  msg,
  NavBar,
  View,
  ViewParams,
} from "common-app-module";

export default class Layout extends View {
  private static current: Layout;

  public static append(node: DomNode): void {
    Layout.current.content.append(node);
  }

  private navBar: NavBar;
  private content: DomNode;

  constructor(params: ViewParams, uri: string) {
    super();
    Layout.current = this;

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
        this.content = el(
          "main",
        ),
      ),
    );

    this.changeUri(uri);
  }

  public changeParams(params: ViewParams, uri: string): void {
    this.changeUri(uri);
  }

  private changeUri(uri: string): void {
    this.navBar.active(
      uri === "" ? "bridge" : uri.substring(
        0,
        uri.indexOf("/") === -1 ? uri.length : uri.indexOf("/"),
      ),
    );
  }
}
