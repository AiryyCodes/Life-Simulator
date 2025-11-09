import { WebService } from "@lib/service";
import { useMainStore } from "@lib/store/main.store";
import { RPCHandler } from "@shared/rpc/rpc";
import type { PlayerInfo } from "@shared/types/player";

@WebService()
export class MainService {
	@RPCHandler("browser:player:update")
	onPlayerUpdate(player: PlayerInfo) {
		console.log("Updating player data...");
		useMainStore.getState().updatePlayer(player);
	}
}
