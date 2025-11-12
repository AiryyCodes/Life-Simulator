import { Player } from "@prisma/client";
import { Vector3 } from "@shared/math";
import type { PlayerInfo } from "@shared/types/player";
import type { RPCInfo } from "@shared/types/rpc";

export type RPCHandlers = {
	// UI
	"ui:menu:toggle": (menu: string) => void;
	"ui:menu:show": (menu: string) => void;
	"ui:menu:hide": () => void;

	"browser:page:show": (page: string) => void;
	"browser:page:close": () => void;
	"browser:player:update": (player: PlayerInfo) => void;

	// Auth
	"client:auth:menu:show": () => void;
	"client:auth:login:success": (token: string) => void;
	"client:auth:login:auto": () => Promise<boolean>;

	"server:auth:login": (info: RPCInfo, email: string, password: string) => Promise<Player | null>;
	"server:auth:login:auto": (info: RPCInfo, token: string) => Promise<Player | null>;
	"server:auth:register": (info: RPCInfo, username: string, email: string, password: string, confirmPassword: string) => Promise<string | null>;

	// Player
	"client:player:rotation:get": () => Vector3;
	"client:player:camera:rotation:get": (name?: string) => Vector3;

	// Admin
	"client:admin:player:get": () => PlayerInfo;
	"client:admin:noclip:toggle": (state: boolean) => boolean;
	"client:admin:godmode:toggle": (state: boolean) => boolean;

	"server:admin:heal": (info: RPCInfo) => void;
	"server:admin:vehicle:repair": (info: RPCInfo) => void;
	"server:admin:vehicle:spawn": (info: RPCInfo, modelName: string) => Promise<void>;

	// Vehicle
	"client:vehicle:model:validate": (modelName: string) => boolean;

	"server:vehicle:plate:change": (info: RPCInfo, numberPlate: string) => void;
};

export const pendingRpcHandlers: {
	name: keyof RPCHandlers;
	target: any;
	method: Function;
}[] = [];
