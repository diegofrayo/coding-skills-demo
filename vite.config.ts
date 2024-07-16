import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "tailwindcss";

// https://vitejs.dev/config
/** @type {import('vite').UserConfig} */
export default defineConfig({
	plugins: [react(), tsconfigPaths()],
	css: {
		postcss: {
			plugins: [tailwindcss()],
		},
	},
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: ["./tests/setupTests.ts"],
	},
});
