import type { PlayerInfo } from "@shared/types/player";
import type { RPCInfo } from "@shared/types/rpc";

export type RPCHandlers = {
	"ui:menu:toggle": (menu: string) => void;
	"ui:menu:show": (menu: string) => void;
	"ui:menu:hide": () => void;

	"browser:page:show": (page: string) => void;
	"browser:page:close": () => void;
	"browser:player:update": (player: PlayerInfo) => void;

	"client:vehicle:model:validate": (modelName: string) => void;

	"client:admin:player:get": () => PlayerInfo;
	"client:admin:noclip:toggle": (state: boolean) => boolean;
	"client:admin:godmode:toggle": (state: boolean) => boolean;

	"server:admin:heal": (info: RPCInfo) => void;

	"server:admin:vehicle:repair": (info: RPCInfo) => void;
	"server:admin:vehicle:spawn": (info: RPCInfo, modelName: string) => Promise<void>;

	"server:vehicle:plate:change": (info: RPCInfo, numberPlate: string) => void;
};

export const pendingRpcHandlers: {
	name: keyof RPCHandlers;
	target: any;
	method: Function;
}[] = [];
