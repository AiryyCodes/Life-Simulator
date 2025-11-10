import { useMainStore } from "@lib/store/main.store";
import { RPCHandler } from "@shared/rpc/rpc";
import { Service } from "@shared/service/service";
import type { PlayerInfo } from "@shared/types/player";

@Service({ side: "web" })
export class MainService {
	@RPCHandler("browser:player:update")
	onPlayerUpdate(player: PlayerInfo) {
		console.log("Updating player data...");
		useMainStore.getState().updatePlayer(player);
	}
}
