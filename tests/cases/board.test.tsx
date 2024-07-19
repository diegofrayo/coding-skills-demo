import * as React from "react";
import { render, screen, within } from "../utils";
import App from "../../src/pages/home";

describe("board", () => {
	beforeEach(() => {
		injectInitialData();
	});

	afterEach(() => {
		clearData();
	});

	it("add candidate button only appears in the first column", async () => {
		render(<App />);

		/*
		 * BUTTON ONLY SHOULD APPEAR IN THE FIRST COLUMN
		 */
		expect(
			within(screen.getByTestId(DATA.steps[0])).getByRole("button", {
				name: /agregar candidato/i,
			}),
		).toBeInTheDocument();

		/*
		 * ONLY SHOULD EXIST ONE ADD CANDIDATE BUTTON
		 */
		expect(
			screen.getByRole("button", {
				name: /agregar candidato/i,
			}),
		).toBeInTheDocument();
	});

	it("board has five columns", async () => {
		render(<App />);

		/*
		 * CHECK IF STEP CONTAINER EXIST
		 */
		DATA.steps.forEach((step) => {
			expect(screen.getByTestId(step)).toBeInTheDocument();
		});

		/*
		 * CHECK IF NUMBER OF COLUMNS IS EQUALS TO NUMBER OF STEPS
		 */
		expect(document.getElementsByClassName("step-container").length).equals(DATA.steps.length);
	});

	it("'there is no candidates' message appears when a step doesn't have candidates", async () => {
		render(<App />);

		/*
		 * THE MESSAGE DOES NOT APPEAR IN A COLUMN WITH CANDIDATES
		 */
		const candidateStepContainer = screen.getByTestId(DATA.candidate.step);

		expect(within(candidateStepContainer).queryByText("No hay candidatos")).not.toBeInTheDocument();

		/*
		 * THE MESSAGE APPEAR IN A COLUMN WITHOUT CANDIDATES
		 */
		const anotherEmptyStepContainer = screen.getByTestId(DATA.steps[2]);

		expect(within(anotherEmptyStepContainer).queryByText("No hay candidatos")).toBeInTheDocument();
	});
});

// --- MOCKS ---

const DATA = {
	candidate: {
		id: "diego-rayo",
		name: "Diego Rayo",
		comments: "Role: Frontend Developer",
		step: "entrevista-inicial",
	},
	steps: ["entrevista-inicial", "entrevista-tecnica", "oferta", "asignacion", "rechazo"],
};

function injectInitialData() {
	window.localStorage.setItem("CANDIDATES", JSON.stringify([DATA.candidate]));
}

function clearData() {
	window.localStorage.clear();
}
