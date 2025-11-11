import { ENV } from "@shared/env";
import rpc, { Player } from "rage-rpc";
import { pendingRpcHandlers, type RPCHandlers } from "@shared/rpc/handlers";

export function RPCHandler<K extends keyof RPCHandlers>(name: K) {
	return <T>(target: T, _key: string | symbol, descriptor: TypedPropertyDescriptor<RPCHandlers[K]>) => {
		const originalMethod = descriptor?.value!;

		pendingRpcHandlers.push({
			name,
			target: (target as any).constructor,
			method: originalMethod,
		});
	};
}

class RPC {
	register(name: keyof RPCHandlers, callback: (...args: any[]) => void) {
		rpc.register(name, (data: any[], info) => {
			if (ENV === "server") {
				return Array.isArray(data) ? callback(info, ...data) : callback(info, data);
			}

			return Array.isArray(data) ? callback(...data) : callback(data);
		});
	}

	unregister(name: string) {
		rpc.unregister(name);
	}

	async callServer(name: keyof RPCHandlers, args?: any) {
		const response = await rpc.callServer(name, args);

		return response?.err ? Promise.reject(response.err) : response;
	}

	async callClient(name: keyof RPCHandlers, args?: any): Promise<any>;
	async callClient(player: Player, name: keyof RPCHandlers, args?: any): Promise<any>;

	async callClient(arg1: any, arg2?: any, arg3?: any): Promise<any> {
		let response;

		if (typeof arg1 === "string") {
			// callClient(name, args)
			response = await rpc.callClient(arg1, arg2);
		} else {
			// callClient(player, name, args)
			const player: Player = arg1;
			const name: string = arg2;
			const args = arg3;
			response = await rpc.callClient(player, name, args);
		}

		return response?.err ? Promise.reject(response.err) : response;
	}

	async callBrowsers(name: keyof RPCHandlers, args?: any): Promise<any>;
	async callBrowsers(player: Player, name: keyof RPCHandlers, args?: any): Promise<any>;

	async callBrowsers(arg1: any, arg2?: any, arg3?: any): Promise<any> {
		let response;

		if (typeof arg1 === "string") {
			// callBrowsers(name, args)
			response = await rpc.callBrowsers(arg1, arg2);
		} else {
			// callBrowsers(player, name, args)
			const player: Player = arg1;
			const name: string = arg2;
			const args = arg3;
			response = await rpc.callBrowsers(player, name, args);
		}

		return response?.err ? Promise.reject(response.err) : response;
	}
}

const myRpc = new RPC();

export default myRpc;
