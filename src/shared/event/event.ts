import { getEnvironmentServices } from "@shared/service/service";

export const pendingEventHandlers: {
	name: string;
	target: any;
	method: Function;
}[] = [];

type EventRegisterCallback = (eventName: string, callback: (...args: any[]) => void) => void;

export class EventManager {
	static init(register: EventRegisterCallback) {
		const envServices = getEnvironmentServices();

		// Register events
		for (const handler of pendingEventHandlers) {
			const instance = envServices.get(handler.target);
			if (!instance) continue; // Skip services for other environment

			console.log("Registering event:", handler.name);

			register(handler.name, (...args: any[]) => handler.method.apply(instance, args));
		}
	}
}
