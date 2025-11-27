import { Service } from "@shared/service/service";
import { Tick } from "@shared/util/tick";

const TRASH_MODELS = ["prop_dumpster_4a"].map((m) => mp.game.joaat(m));

const SEARCH_RADIUS = 5.0;
const INTERACT_DISTANCE = 2.0;

@Service({ side: "client" })
export class TrashService {
	private isShowing = false;

	@Tick(250)
	private onTick() {
		const player = mp.players.local;
		if (!player) return;

		const handle = this.getClosestTrashCan();

		if (handle && !this.isShowing) {
			this.isShowing = true;
			showHelpText("Press ~INPUT_CONTEXT~ to search.");
		}

		if (!handle && this.isShowing) {
			this.isShowing = false;
			mp.game.ui.clearHelp(true);
		}
	}

	private getClosestTrashCan() {
		const pos = mp.players.local.position;

		for (const hash of TRASH_MODELS) {
			// mp.gui.chat.push("Hash: " + hash);
			const handle = mp.game.object.getClosestObjectOfType(pos.x, pos.y, pos.z, SEARCH_RADIUS, hash, false, false, false);

			if (handle !== 0) {
				const objPos = mp.game.invokeVector3("0x3FEF770D40960D5A", handle, true);

				const dist = mp.game.system.vdist(pos.x, pos.y, pos.z, objPos.x, objPos.y, objPos.z);

				if (dist < INTERACT_DISTANCE) {
					return handle;
				}
			}
		}

		return null;
	}
}

function showHelpText(text: string) {
	mp.game.ui.setTextComponentFormat("STRING");
	mp.game.ui.addTextComponentSubstringPlayerName(text);
	mp.game.ui.displayHelpTextFromStringLabel(0, false, true, -1);
}
