import { getEnvironmentServices } from "@shared/service/service";

type CommandFunc = (player: PlayerMp, ...args: any[]) => void | Promise<void>;

export const pendingCommandHandlers: {
	name: string;
	target: any;
	method: Function;
}[] = [];

export function Command(name: string) {
	return function (target: any, _propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
		const handler = descriptor.value as CommandFunc;

		pendingCommandHandlers.push({
			name: name,
			target: target.constructor,
			method: handler,
		});
	};
}

export class CommandManager {
	static init() {
		const envServices = getEnvironmentServices();

		for (const { name, target, method } of pendingCommandHandlers) {
			const instance = envServices.get(target);
			if (!instance) continue; // Skip services for other environments

			console.log("Registering command:", name);

			mp.events.addCommand(name, (player, _fullText, ...args) => {
				const result = method.apply(instance, [player, ...args]);
				if (result instanceof Promise) {
					result.catch((err) => {
						console.error(`Error in command ${name}:`, err);
					});
				}
			});
		}
	}
}
