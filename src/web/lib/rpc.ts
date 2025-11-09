import rpc from "rage-rpc";

class WebRpc {
	register(name: string, callback: (...args: any[]) => void) {
		rpc.register(name, (data: any[]) => {
			return Array.isArray(data) ? callback(...data) : callback(data);
		});
	}

	async callServer(name: string, args?: any) {
		const response = await rpc.callServer(name, args);
		return response?.err ? Promise.reject(response.err) : response;
	}
}

export const rpcInstance = new WebRpc();
export const webRpc = rpcInstance;
