type Constructor<T = any> = new (...args: any[]) => T;

const webServices = new Map<Function, any>();

export function WebService(): ClassDecorator {
	return (target: any) => {
		if (!webServices.has(target)) {
			const instance = new target();
			webServices.set(target, instance);
		}
	};
}

export class WebServiceManager {
	static get<T>(cls: new (...args: any[]) => T): T {
		const instance = webServices.get(cls);
		if (!instance) {
			const newInstance = new cls();
			webServices.set(cls, newInstance);
			return newInstance;
		}
		return instance;
	}
}
