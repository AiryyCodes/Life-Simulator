import type { RPCInfo } from "@/types/rpc";
import { RPCHandler } from "@shared/rpc/rpc";
import { Service } from "@shared/service/service";

@Service({ side: "server" })
export class VehicleService {
	@RPCHandler("server:vehicle:plate:change")
	onPlateChange(info: RPCInfo, numberPlate: string) {
		const player = info.player;
		if (!player) return;

		const vehicle = player.vehicle;
		if (!vehicle) return;

		vehicle.numberPlate = numberPlate;
	}
}
