import myRpc, { RPCHandler } from "@shared/rpc/rpc";
import { Service } from "@shared/service/service";

@Service({ side: "client" })
export class VehicleService {
	@RPCHandler("vehicle:model:validate")
	onModelValidate(modelName: string): boolean {
		const hash = mp.game.joaat(modelName);

		const isValid = mp.game.streaming.isModelInCdimage(hash) && mp.game.streaming.isModelAVehicle(hash);
		return isValid;
	}

	@RPCHandler("client:vehicle:plate:change")
	onPlateChange(numberPlate: string) {
		const player = mp.players.local;
		const vehicle = player.vehicle;
		if (!vehicle) return;

		myRpc.callServer("server:vehicle:plate:change", numberPlate);
	}
}
