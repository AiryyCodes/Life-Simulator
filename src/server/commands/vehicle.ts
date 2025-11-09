import { Command } from "@/decorators/command";
import myRpc from "@shared/rpc/rpc";

export class VehicleCommand {
	/*
	@Command("vehicle")
	onCommand(player: PlayerMp, modelName: string): void {
		if (!modelName) {
			player.outputChatBox("!{red}You must specify a vehicle to spawn");
			return;
		}

		myRpc.callServer("server:admin:vehicle:spawn", [player, modelName]);
	}
	*/
	/*
	@EventHandler(ClientEvents.VALIDATE_VEHICLE_RESPONSE)
	onVehicleSpawn(player: PlayerMp, modelName: string, isValid: boolean): void {
		if (!isValid) {
			player.outputChatBox(`!{red} Vehicle ${modelName} not found`);
			return;
		}

		if (player.vehicle) {
			player.vehicle.destroy();
		}

		const hash = mp.joaat(modelName);

		const vehicle = mp.vehicles.new(hash, player.position, {
			heading: player.heading,
			numberPlate: "New Vehicle",
			color: [
				[RandomInRange(0, 255), RandomInRange(0, 255), RandomInRange(0, 255)],
				[RandomInRange(0, 255), RandomInRange(0, 255), RandomInRange(0, 255)],
			],
		});

		player.putIntoVehicle(vehicle, 0);
		player.outputChatBox(`!{green}Spawned ${modelName}`);
	}
	*/
}
