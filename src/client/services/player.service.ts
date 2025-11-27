import { Vector3 } from "@shared/math";
import { RPCHandler } from "@shared/rpc/rpc";
import { Service, ServiceManager } from "@shared/service/service";
import { AdminService } from "./admin.service";
import { Tick } from "@shared/util/tick";

@Service({ side: "client" })
export class PlayerService {
	@RPCHandler("client:player:rotation:get")
	private onGetRotation(): Vector3 {
		const player = mp.players.local;
		return player.getRotation(2);
	}

	@RPCHandler("client:player:camera:rotation:get")
	private onGetCameraRotation(name?: string): Vector3 {
		if (name === "default") {
			const adminService = ServiceManager.get(AdminService);
			if (adminService.noclipCamera) {
				return adminService.noclipCamera.getRot(2);
			}
		}

		const camera = mp.cameras.gameplay;
		return camera.getRot(2);
	}
}
