import { RPCInfo as RPCInfoBase } from "@shared/types/rpc";
import { ProcedureListenerInfo } from "rage-rpc";

export interface RPCInfo extends RPCInfoBase, ProcedureListenerInfo {
	player?: PlayerMp;
}
