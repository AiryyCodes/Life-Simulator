import "reflect-metadata";
import { getEnvironment } from "../env";

type ServiceSide = "client" | "server" | "shared";

interface ServiceOptions {
	side?: ServiceSide;
}

const services = new Map<Function, any>();

export function Service(options: ServiceOptions = {}): ClassDecorator {
	return (target) => {
		const side = options.side ?? "shared";

		if (side === "shared" || side === getEnvironment()) {
			const deps = Reflect.getMetadata("design:paramtypes", target) || [];
			const injections = deps.map((dep: any) => ServiceManager.get(dep));
			const instance = new (target as any)(...injections);

			if (typeof instance.onInit === "function") instance.onInit.call(instance);

			services.set(target, instance);
		}
	};
}

export class ServiceManager {
	static get<T>(cls: new (...args: any[]) => T): T {
		const instance = services.get(cls);
		if (!instance) {
			const deps = Reflect.getMetadata("design:paramtypes", cls) || [];
			const injections = deps.map((dep: any) => this.get(dep));
			const newInstance = new cls(...injections);
			services.set(cls, newInstance);
			return newInstance;
		}
		return instance;
	}
}
