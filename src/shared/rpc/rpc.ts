import { ENV } from "../env";
import rpc, { Player } from "rage-rpc";

export function RPCHandler(name: string): MethodDecorator {
	return (target, _key, descriptor) => {
		if (!descriptor || !descriptor.value || typeof descriptor.value !== "function") {
			throw new Error(`@RPCHandler can only be applied to methods`);
		}

		const originalMethod = descriptor.value as (...args: any[]) => any;

		// Register the method after service is initialized
		setTimeout(() => {
			myRpc.register(name, (...args: any[]) => {
				return originalMethod.apply(target, args);
			});
		}, 0);
	};
}

class RPC {
	register(name: string, callback: (...args: any[]) => void) {
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

	async callServer(name: string, args?: any) {
		const response = await rpc.callServer(name, args);

		return response?.err ? Promise.reject(response.err) : response;
	}

	async callClient(name: string, args?: any): Promise<any>;
	async callClient(player: Player, name: string, args?: any): Promise<any>;

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

	async callBrowsers(name: string, args?: any): Promise<any>;
	async callBrowsers(player: Player, name: string, args?: any): Promise<any>;

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
