import myRpc, { RPCHandler } from "@shared/rpc/rpc";
import { Service } from "@shared/service/service";
import rpc from "rage-rpc";

@Service({ side: "client" })
export class UIService {
	public ui: BrowserMp | null = null;

	public currentMenu: string | null = null;

	public canExit(): boolean {
		return this.currentMenu === null || this.currentMenu !== "auth";
	}

	onInit() {
		this.ui = mp.browsers.new("http://127.0.0.1:5173/");

		mp.keys.bind(0x1b, false, () => {
			if (!this.currentMenu) return;
			if (this.currentMenu == "auth") return;

			myRpc.callClient("ui:menu:hide");
		});
	}

	@RPCHandler("ui:menu:toggle")
	onMenuToggle(menu: string) {
		const browser = mp.browsers.at(0) || this.ui;

		if (this.currentMenu === menu) {
			// Close it
			rpc.callBrowser(browser, "browser:page:close", menu);
			this.currentMenu = null;
			this.setControls(false);
		} else {
			// Show it (replace previous if any)
			rpc.callBrowser(browser, "browser:page:show", menu);
			this.currentMenu = menu;
			this.setControls(true);
		}
	}

	@RPCHandler("ui:menu:show")
	onMenuShow(menu: string) {
		const browser = mp.browsers.at(0) || this.ui;
		rpc.callBrowser(browser, "browser:page:show", menu);
		this.currentMenu = menu;

		this.setControls(true);
	}

	@RPCHandler("ui:menu:hide")
	onMenuHide() {
		const browser = mp.browsers.at(0) || this.ui;
		rpc.callBrowser(browser, "browser:page:close", this.currentMenu);
		this.currentMenu = null;
		this.setControls(false);
	}

	private setControls(status: boolean) {
		mp.gui.cursor.visible = status;
		mp.gui.cursor.show(status, status);
		mp.game.ui.displayRadar(!status);

		// Disable pause menu when menu is open
		mp.game.controls.disableControlAction(32, 200, status); // INPUT_FRONTEND_PAUSE
	}
}
