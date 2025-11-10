import { EventHandler } from "@/decorators/event";
import { Service } from "@shared/service/service";

@Service({ side: "server" })
export class MainService {
	@EventHandler("playerDeath")
	onDeath(player: PlayerMp, _reason: number, _killer?: PlayerMp): void {
		setTimeout(() => {
			player.spawn(new mp.Vector3(-425.517, 1123.62, 325.8544));
		}, 3000);
	}
}
