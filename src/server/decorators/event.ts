export function EventHandler(name: string) {
	return function (target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
		const originalMethod = descriptor.value as (...args: any[]) => any;

		mp.events.add(name, (...args) => {
			originalMethod.apply(target, args);
		});
	};
}
