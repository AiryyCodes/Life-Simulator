import { EventHandler } from "@/decorators/event";
import { ClientEvents, ServerEvents } from "@shared/types/events";

export class VehicleEvents {
	@EventHandler(ServerEvents.VALIDATE_VEHICLE)
	onVehicleSpawnRequest(modelName: string): void {
		const hash = mp.game.joaat(modelName);

		const isValid = mp.game.streaming.isModelInCdimage(hash) && mp.game.streaming.isModelAVehicle(hash);

		mp.events.callRemote(ClientEvents.VALIDATE_VEHICLE_RESPONSE, modelName, isValid);
	}
}
