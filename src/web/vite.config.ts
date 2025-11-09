import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	base: "./",
	build: {
		outDir: "../../dist/client_packages/ui",
		emptyOutDir: true,
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
			"@lib": path.resolve(__dirname, "./lib"),
			"@shared": path.resolve(__dirname, "../shared"),
		},
	},
	server: {
		host: "0.0.0.0",
		port: 5173,
	},
});
