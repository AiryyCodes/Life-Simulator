import "reflect-metadata";
import { getEnvironment } from "@shared/env";
import myRpc from "@shared/rpc/rpc";
import { pendingRpcHandlers } from "@shared/rpc/handlers";

type ServiceSide = "client" | "server" | "web" | "shared";

interface ServiceOptions {
	side?: ServiceSide;
}

const services: Map<any, any> = new Map();
const clientServices: Map<any, any> = new Map();
const serverServices: Map<any, any> = new Map();
const webServices: Map<any, any> = new Map();

export function getEnvironmentServices() {
	const env = getEnvironment();

	if (env === "client") return clientServices;
	if (env === "server") return serverServices;
	if (env === "web") return webServices;
	return services; // shared
}

export function Service(options: ServiceOptions = {}): ClassDecorator {
	return (target) => {
		const side = options.side ?? "shared";

		if (side === "shared" || side === getEnvironment()) {
			const deps = Reflect.getMetadata("design:paramtypes", target) || [];
			const injections = deps.map((dep: any) => ServiceManager.get(dep));
			const instance = new (target as any)(...injections);

			console.log("Registering service:", target.name);

			const envServices = getEnvironmentServices();
			envServices.set(target, instance);
		}
	};
}

export class ServiceManager {
	static init() {
		const envServices = getEnvironmentServices();

		// Call onInit
		envServices.forEach((instance) => {
			if (typeof instance.onInit === "function") instance.onInit();
		});

		// Register RPCs
		for (const { name, target, method } of pendingRpcHandlers) {
			const instance = envServices.get(target);
			if (!instance) continue; // Skip services for other environments

			console.log("Registering RPC handler:", name);

			myRpc.register(name, (...args: any[]) => method.apply(instance, args));
		}
	}

	static get<T>(cls: new (...args: any[]) => T): T {
		const envServices = getEnvironmentServices();
		const instance = envServices.get(cls);
		if (!instance) {
			throw new Error(`Service ${cls.name} not initialized for ${getEnvironment()}`);
		}
		return instance;
	}
}
