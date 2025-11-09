import type { PlayerInfo } from "@/types/player";
import type { RPCInfo } from "@/types/rpc";

export interface RPCHandlers {
	"ui:menu:toggle": (menu: string) => void;
	"ui:menu:show": (menu: string) => void;
	"ui:menu:hide": () => void;

	"client:vehicle:model:validate": (modelName: string) => void;

	"client:admin:player:get": () => PlayerInfo;

	"server:admin:heal": (info: RPCInfo) => void;
	"server:admin:vehicle:repair": (info: RPCInfo) => void;
	"server:admin:vehicle:spawn": (info: RPCInfo, modelName: string) => Promise<void>;

	"server:vehicle:plate:change": (info: RPCInfo, numberPlate: string) => void;
}
