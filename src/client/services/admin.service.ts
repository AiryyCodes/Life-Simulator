import { EventHandler } from "@/decorators/event";
import { Service } from "@shared/service/service";
import rpc from "rage-rpc";
import { UIService } from "./ui.service";
import { RPCHandler } from "@shared/rpc/rpc";
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
