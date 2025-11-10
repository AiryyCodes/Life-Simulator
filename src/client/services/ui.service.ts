import myRpc, { RPCHandler } from "@shared/rpc/rpc";
import { Service } from "@shared/service/service";
import rpc from "rage-rpc";

@Service({ side: "client" })
export class UIService {
	public ui: BrowserMp | null = null;

	private menuShown = false;

	onInit() {
		this.ui = mp.browsers.new("http://127.0.0.1:5173/");

		mp.keys.bind(0x1b, false, () => {
			if (!this.menuShown) return;

			myRpc.callClient("ui:menu:hide");
		});
	}

	@RPCHandler("ui:menu:toggle")
	onMenuToggle(menu: string) {
		const browser = mp.browsers.at(0) || this.ui;

		if (!this.menuShown) {
			rpc.callBrowser(browser, "browser:page:show", menu);
		} else {
			rpc.callBrowser(browser, "browser:page:close");
		}
		this.menuShown = !this.menuShown;

		this.setControls(this.menuShown);
	}

	@RPCHandler("ui:menu:show")
	onMenuShow(menu: string) {
		const browser = mp.browsers.at(0) || this.ui;
		rpc.callBrowser(browser, "browser:page:show", menu);
		this.menuShown = true;

		this.setControls(this.menuShown);
	}

	@RPCHandler("ui:menu:hide")
	onMenuHide() {
		const browser = mp.browsers.at(0) || this.ui;
		rpc.callBrowser(browser, "browser:page:close");
		this.menuShown = false;

		this.setControls(this.menuShown);
	}

	private setControls(status: boolean) {
		mp.gui.cursor.visible = status;
		mp.gui.cursor.show(status, status);
		mp.game.ui.displayRadar(!status);

		// Disable pause menu when menu is open
		mp.game.controls.disableControlAction(32, 200, status); // INPUT_FRONTEND_PAUSE
	}
}
