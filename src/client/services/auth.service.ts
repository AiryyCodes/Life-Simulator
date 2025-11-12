import myRpc, { RPCHandler } from "@shared/rpc/rpc";
import { Service } from "@shared/service/service";

@Service({ side: "client" })
export class AuthService {
	// Maze Bank overview camera
	private overviewCamera: CameraMp | null = null;
	private overviewCoords: Vector3 = new mp.Vector3(143.08, -1103.45, 346.53);
	private overviewRotation: Vector3 = new mp.Vector3(-9.21, 0, 12.95);
	// private overviewHeading: number = 17.37;

	@RPCHandler("client:auth:menu:show")
	onMenuShow() {
		const player = mp.players.local;
		if (!player) return;

		this.overviewCamera = mp.cameras.new("default", this.overviewCoords, this.overviewRotation, 45);
		this.overviewCamera.setActive(true);
		mp.game.cam.renderScriptCams(true, false, 0, false, false, 0);

		mp.gui.chat.show(false);

		myRpc.callClient("ui:menu:show", "auth");
	}

	@RPCHandler("client:auth:login:success")
	onLoginSuccess(token: string) {
		mp.storage.data.token = token;
		mp.storage.flush();

		this.overviewCamera?.destroy();
		this.overviewCamera = null;

		// Transition back to normal gameplay camera
		mp.game.cam.renderScriptCams(false, true, 2500, true, false, 0);

		myRpc.callClient("ui:menu:hide");
		mp.gui.chat.show(true);
	}

	@RPCHandler("client:auth:login:auto")
	async onAutoLogin(): Promise<boolean> {
		const token = mp.storage.data.token;
		if (!token || token == "") return false;

		const authPlayer = await myRpc.callServer("server:auth:login:auto", token);
		if (!authPlayer) return false;

		return true;
	}
}
