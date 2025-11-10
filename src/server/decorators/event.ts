import { pendingEventHandlers } from "@shared/event/event";

export function EventHandler<K extends keyof IServerEvents | (string & {})>(name: K) {
	return function <T extends (...args: K extends keyof IServerEvents ? Parameters<IServerEvents[K]> : any[]) => void>(
		target: any,
		_propertyKey: string,
		descriptor: TypedPropertyDescriptor<T>,
	) {
		const originalMethod = descriptor.value!;

		pendingEventHandlers.push({
			name: name,
			target: target.constructor,
			method: originalMethod,
		});
	};
}
