import { EventHandler } from "@/decorators/event";
import { Service } from "@shared/service/service";
import rpc from "rage-rpc";
import { UIService } from "./ui.service";
import myRpc, { RPCHandler } from "@shared/rpc/rpc";
import type { PlayerInfo } from "@shared/types/player";
import { VehicleInfo } from "@shared/types/vehicle";
import { cross, normalize } from "@shared/math";

@Service({ side: "client" })
export class AdminService {
	constructor(private uiService: UIService) {}

	private noclipCamera: CameraMp | null = null;

	onInit() {
		mp.keys.bind(0x73, false, () => {
			console.log(myRpc.callClient("ui:menu:toggle", "admin"));
		});
	}

	@EventHandler("admin:menu:show")
	onAdminMenuShow(_player: PlayerMp) {
		const browser = mp.browsers.at(0) || this.uiService.ui;
		rpc.callBrowser(browser, "browser:page:show", "admin");
	}

	@EventHandler("admin:menu:hide")
	onAdminMenuHide(_player: PlayerMp) {
		const browser = mp.browsers.at(0) || this.uiService.ui;
		rpc.callBrowser(browser, "browser:page:close");
	}

	@RPCHandler("client:admin:player:get")
	onGetPlayer(): PlayerInfo {
		const player = mp.players.local;
		return AdminService.serializePlayer(player);
	}

	@RPCHandler("client:admin:godmode:toggle")
	onGodmodeToggle(state: boolean): boolean {
		const player = mp.players.local;
		if (!player) return false;

		player.godmode = state;

		player.setInvincible(state);

		return state;
	}

	@RPCHandler("client:admin:noclip:toggle")
	onNoclipToggle(state: boolean): boolean {
		const player = mp.players.local;
		player.noclip = state;

		if (state) {
			const cameraRotation = mp.game.cam.getGameplayCamRot(2);
			this.noclipCamera = mp.cameras.new("default", player.position, cameraRotation, 45);
			this.noclipCamera.setActive(true);
			mp.game.cam.renderScriptCams(true, false, 0, true, false, 0);
		} else if (!state && this.noclipCamera) {
			player.position = this.noclipCamera.getCoord();
			player.setHeading(this.noclipCamera.getRot(2).z);
			this.noclipCamera.destroy();
			this.noclipCamera = null;

			mp.game.cam.renderScriptCams(false, false, 0, true, false, 0);
		}

		player.freezePosition(state);

		if (player.godmode && state === true) {
			player.setInvincible(state);
		}
		player.setVisible(!state, !state);
		player.setCollision(!state, state);

		return state;
	}

	@EventHandler("render")
	onNoclipRender() {
		if (!this.noclipCamera || mp.gui.cursor.visible) return;

		const controlModifier = mp.keys.isDown(17);
		const shiftModifier = mp.keys.isDown(16);

		const rotation = this.noclipCamera.getRot(2);

		let speedMultiplier = 1;

		if (shiftModifier) {
			speedMultiplier = 3;
		} else if (controlModifier) {
			speedMultiplier = 0.5;
		}

		const rightAxisX = mp.game.controls.getDisabledControlNormal(0, 220);
		const rightAxisY = mp.game.controls.getDisabledControlNormal(0, 221);
		const leftAxisX = mp.game.controls.getDisabledControlNormal(0, 218);
		const leftAxisY = mp.game.controls.getDisabledControlNormal(0, 219);

		const position = this.noclipCamera.getCoord();
		const direction = this.noclipCamera.getDirection();
		const vector = new mp.Vector3(0, 0, 0);

		vector.x = direction.x * leftAxisY * speedMultiplier;
		vector.y = direction.y * leftAxisY * speedMultiplier;
		vector.z = direction.z * leftAxisY * speedMultiplier;

		const up = new mp.Vector3(0, 0, 1);
		const right = cross(normalize(direction), normalize(up));

		right.x *= leftAxisX * 0.5;
		right.y *= leftAxisX * 0.5;
		right.z *= leftAxisX * 0.5;

		let movement = 0.0;
		if (mp.keys.isDown(69)) {
			movement = 0.5;
		}

		if (mp.keys.isDown(81)) {
			movement = -0.5;
		}

		const player = mp.players.local;
		player.position = new mp.Vector3(position.x + vector.x + 1, position.y + vector.y + 1, position.z + vector.z + 1);
		player.heading = direction.z;
		this.noclipCamera.setCoord(position.x - vector.x + right.x, position.y - vector.y + right.y, position.z - vector.z + right.z + movement);
		this.noclipCamera.setRot(rotation.x + rightAxisY * -5.0, 0.0, rotation.z + rightAxisX * -5.0, 2);
	}

	static serializePlayer(player: PlayerMp): PlayerInfo {
		const vehicle = player.vehicle ? AdminService.serializeVehicle(player.vehicle) : null;

		return {
			name: player.name,
			health: player.getHealth(),
			maxHealth: player.getMaxHealth() - 100, // TODO: Temporary fix (probably not)
			vehicle,
		};
	}

	static serializeVehicle(vehicle: VehicleMp): VehicleInfo {
		const model = vehicle.model;
		const displayName = mp.game.vehicle.getDisplayNameFromVehicleModel(model);
		const name = mp.game.ui.getLabelText(displayName);

		return {
			model: model,
			name: name,
			health: vehicle.getHealth(),
			maxHealth: vehicle.getMaxHealth(),
			plate: vehicle.getNumberPlateText(),
		};
	}
}
