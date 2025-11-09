export type Environment = "server" | "client" | "shared";

// Default to "shared" so that shared modules can import safely
export let ENV: Environment = "shared";

/**
 * Set the runtime environment for this side (server or client).
 * Must be called at startup before loading services.
 */
export function setEnvironment(env: Environment) {
	ENV = env;
}

export function getEnvironment() {
	return ENV;
}
