import { EventHandler } from "@/decorators/event";
import { Service, ServiceManager } from "@shared/service/service";
import rpc from "rage-rpc";
import { UIService } from "./ui.service";
import myRpc, { RPCHandler } from "@shared/rpc/rpc";
import type { PlayerInfo } from "@shared/types/player";
import { VehicleInfo } from "@shared/types/vehicle";
import { cross, normalize } from "@shared/math";

@Service({ side: "client" })
export class AdminService {
	constructor(private uiService: UIService) {}

	noclipCamera: CameraMp | null = null;

	onInit() {
		mp.keys.bind(0x73, false, () => {
			const uiService = ServiceManager.get(UIService);
			if (!uiService.canExit()) return;

			myRpc.callClient("ui:menu:toggle", "admin");
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

			const camHandle = this.noclipCamera.handle;
			mp.game.invoke("0x661B5C8654ADD825", camHandle, true); // SET_CAM_CONTROLS_MINI_MAP_HEADING
		} else if (!state && this.noclipCamera) {
			player.position = this.noclipCamera.getCoord();
			player.setHeading(this.noclipCamera.getRot(2).z);

			const camHandle = this.noclipCamera.handle;
			mp.game.invoke("0x661B5C8654ADD825", camHandle, false); // Disable minimap cam control

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

		const ctrl = mp.keys.isDown(17); // Ctrl
		const shift = mp.keys.isDown(16); // Shift

		const rot = this.noclipCamera.getRot(2); // YXZ (degrees)
		const pos = this.noclipCamera.getCoord();

		// Read analog stick / mouse deltas
		const lookX = mp.game.controls.getDisabledControlNormal(0, 220); // look right/left
		const lookY = mp.game.controls.getDisabledControlNormal(0, 221); // look up/down
		const moveX = mp.game.controls.getDisabledControlNormal(0, 218); // strafe
		const moveY = mp.game.controls.getDisabledControlNormal(0, 219); // forward/back

		// Speed modifier
		let speed = 0.3;
		if (shift) speed = 1.0;
		else if (ctrl) speed = 0.1;

		// --- ROTATION ---
		// Apply directly in degrees (no frameTime scaling)
		const newPitch = Math.max(-89.0, Math.min(89.0, rot.x + lookY * -5.0));
		const newYaw = (rot.z + lookX * -5.0) % 360.0;
		this.noclipCamera.setRot(newPitch, 0.0, newYaw, 2);

		// --- DIRECTION VECTORS ---
		const forward = this.noclipCamera.getDirection();
		const up = new mp.Vector3(0, 0, 1);
		const right = normalize(cross(up, forward));

		// --- MOVEMENT ---
		const move = new mp.Vector3(0, 0, 0);
		move.x -= forward.x * moveY * speed;
		move.y -= forward.y * moveY * speed;
		move.z -= forward.z * moveY * speed;

		move.x -= right.x * moveX * speed * 0.5;
		move.y -= right.y * moveX * speed * 0.5;
		move.z -= right.z * moveX * speed * 0.5;

		if (mp.keys.isDown(69)) move.z += speed; // E
		if (mp.keys.isDown(81)) move.z -= speed; // Q

		this.noclipCamera.setCoord(pos.x + move.x, pos.y + move.y, pos.z + move.z);

		// --- PLAYER ALIGNMENT (for minimap etc.) ---
		const player = mp.players.local;
		const camPos = this.noclipCamera.getCoord();
		player.position = camPos;

		// Get the camera’s forward vector again and compute true heading
		const dir = this.noclipCamera.getDirection();
		const heading = ((Math.atan2(dir.x, dir.y) * 180.0) / Math.PI + 360.0) % 360.0;
		player.setHeading(-heading);
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
