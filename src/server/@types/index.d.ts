import { ProcedureListenerInfo } from "rage-rpc";

declare global {
	interface PlayerMp {}

	interface RPCInfo extends ProcedureListenerInfo {
		player: PlayerMp;
	}
}

export {};
