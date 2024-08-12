import { defineConfig } from "cypress";

export default defineConfig({
	e2e: {
		setupNodeEvents() {
			// implement node event listeners here
		},
		supportFile: "./tests/e2e/config/e2e.ts",
		specPattern: "./tests/e2e/cases/**/*.cy.{js,jsx,ts,tsx}",
	},
});
