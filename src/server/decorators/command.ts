type CommandFunc = (player: PlayerMp, ...args: any[]) => void | Promise<void>;

export function Command(name: string) {
	return function (target: any, _propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
		const handler = descriptor.value as CommandFunc;

		mp.events.addCommand(name, (player, _fullText, ...args) => {
			const result = handler.call(target, player, ...args);
			if (result instanceof Promise) {
				result.catch((err) => {
					console.error(`Error in command ${name}:`, err);
				});
			}
		});
	};
}
