import { Command } from "@/command/command";
import myRpc, { RPCHandler } from "@shared/rpc/rpc";
import { Service } from "@shared/service/service";
import { RandomInRange } from "@shared/random";
import type { RPCInfo } from "@/types/rpc";

@Service({ side: "server" })
export class AdminService {
	@Command("admin")
	async onUIShow(player: PlayerMp) {
		myRpc.callClient(player, "ui:menu:show", "admin");
	}

	@RPCHandler("server:admin:heal")
	onPlayerHeal(info: RPCInfo) {
		const player = info.player;
		if (!player) return;

		player.health = 100;
		player.armour = 100;
	}

	@RPCHandler("server:admin:vehicle:repair")
	onVehicleRepair(info: RPCInfo) {
		const player = info.player;
		if (!player) return;

		const vehicle = player.vehicle;
		if (!vehicle) return;

		vehicle.repair();

		player.outputChatBox("An admin repaired your vehicle.");
	}

	@Command("vehicle")
	onCommand(player: PlayerMp, modelName: string): void {
		if (!modelName) {
			player.outputChatBox("!{red}You must specify a vehicle to spawn");
			return;
		}

		if (player.vehicle) {
			player.vehicle.destroy();
		}

		const vehicle = this.spawnVehicle(player, modelName);

		player.putIntoVehicle(vehicle, 0);
		player.outputChatBox(`!{green}Spawned ${modelName}`);
	}

	@RPCHandler("server:admin:vehicle:spawn")
	async onVehicleSpawn(info: RPCInfo, modelName: string) {
		const player = info.player;
		if (!player) return;

		const isValid = await myRpc.callClient(player, "client:vehicle:model:validate", modelName);
		if (!isValid) {
			player.outputChatBox(`!{red} Vehicle ${modelName} not found`);
			return;
		}

		if (player.vehicle) {
			player.vehicle.destroy();
		}

		const vehicle = this.spawnVehicle(player, modelName);

		player.putIntoVehicle(vehicle, 0);
		player.outputChatBox(`!{green}Spawned ${modelName}`);
	}

	spawnVehicle(player: PlayerMp, modelName: string): VehicleMp {
		const hash = mp.joaat(modelName);

		const vehicle = mp.vehicles.new(hash, player.position, {
			heading: player.heading,
			numberPlate: "New Vehicle",
			color: [
				[RandomInRange(0, 255), RandomInRange(0, 255), RandomInRange(0, 255)],
				[RandomInRange(0, 255), RandomInRange(0, 255), RandomInRange(0, 255)],
			],
		});

		return vehicle;
	}
}
