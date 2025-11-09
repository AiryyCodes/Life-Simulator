import { EventHandler } from "@/decorators/event";

export class DeathEvent {
	@EventHandler("playerDeath")
	onDeath(player: PlayerMp, reason: number, killer: PlayerMp): void {
		setTimeout(() => {
			player.spawn(new mp.Vector3(-425.517, 1123.62, 325.8544));
		}, 3000);
	}
}
