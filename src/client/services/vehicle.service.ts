import { RPCHandler } from "@shared/rpc/rpc";
import { Service } from "@shared/service/service";

@Service({ side: "client" })
export class VehicleService {
	@RPCHandler("client:vehicle:model:validate")
	onModelValidate(modelName: string): boolean {
		const hash = mp.game.joaat(modelName);

		const isValid = mp.game.streaming.isModelInCdimage(hash) && mp.game.streaming.isModelAVehicle(hash);
		return isValid;
	}
}
