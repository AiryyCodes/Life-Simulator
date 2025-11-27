import { getEnvironment } from "@shared/env";

export function Tick(interval = 0) {
	return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		if (getEnvironment() !== "client") return;

		if (!target.__loops) target.__loops = [];

		target.__loops.push({
			method: descriptor.value,
			interval,
		});
	};
}
