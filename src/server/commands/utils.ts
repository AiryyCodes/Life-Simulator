import { Command } from "@/decorators/command";

export class UtilityCommands {
	@Command("heal")
	onHeal(player: PlayerMp): void {}
}
