let globalNavigate: ((path: string, options?: any) => void) | null = null;

export function setNavigate(fn: typeof globalNavigate) {
	globalNavigate = fn;
}

export function navigate(path: string, options?: any) {
	if (!globalNavigate) {
		console.error("Navigate function not set yet!");
		return;
	}
	globalNavigate(path, options);
}
