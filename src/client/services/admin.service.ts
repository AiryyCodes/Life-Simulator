import { EventHandler } from "@/decorators/event";
import { Service } from "@shared/service/service";
import rpc from "rage-rpc";
import { UIService } from "./ui.service";
import myRpc, { RPCHandler } from "@shared/rpc/rpc";
import type { PlayerInfo } from "@shared/types/player";
import { VehicleInfo } from "@shared/types/vehicle";

@Service({ side: "client" })
export class AdminService {
	constructor(private uiService: UIService) {}

	onInit() {
		mp.keys.bind(0x1b, true, () => {
			mp.events.call("admin:menu:hide");
		});
	}

	@EventHandler("admin:menu:show")
	onAdminMenuShow(player: PlayerMp) {
		const browser = mp.browsers.at(0) || this.uiService.ui;
		rpc.callBrowser(browser, "browser:page:show", "admin");
	}

	@EventHandler("admin:menu:hide")
	onAdminMenuHide(player: PlayerMp) {
		const browser = mp.browsers.at(0) || this.uiService.ui;
		rpc.callBrowser(browser, "browser:page:close");
	}

	@RPCHandler("admin:heal")
	onHeal() {
		mp.players.local.setHealth(200);
		mp.players.local.setArmour(100);

		mp.gui.chat.push("An admin restored your health. Stay safe out there!");
	}

	@RPCHandler("admin:vehicle:repair")
	onVehicleRepair() {
		const player = mp.players.local;
		if (!player.vehicle) return;

		myRpc.callServer("admin:vehicle:repair");
	}

	@RPCHandler("client:admin:vehicle:spawn")
	onVehicleSpawn(modelName: string) {
		myRpc.callServer("server:admin:vehicle:spawn", modelName);
	}

	@RPCHandler("admin:player:get")
	onGetPlayer(): PlayerInfo {
		const player = mp.players.local;
		return AdminService.serializePlayer(player);
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
