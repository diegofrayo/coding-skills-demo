import * as React from "react";
import { render, screen, within } from "../utils";
import App from "../../src/pages/home";

describe("rendering board", () => {
	beforeEach(() => {
		mockInitialData();
	});

	afterEach(() => {
		clearData();
	});

	it("add candidate button only appears in the first column", async () => {
		render(<App />);

		expect(
			within(screen.getByTestId(DATA.steps[0])).getByRole("button", {
				name: /agregar candidato/i,
			}),
		).toBeInTheDocument();

		expect(
			screen.getByRole("button", {
				name: /agregar candidato/i,
			}),
		).toBeInTheDocument();
	});

	it("board has five columns", async () => {
		render(<App />);

		DATA.steps.forEach((step) => {
			expect(screen.getByTestId(step)).toBeInTheDocument();
		});

		expect(document.getElementsByClassName("step-container").length).equals(DATA.steps.length);
	});

	it("there is no candidates message appears when a step doesn't have candidates", async () => {
		render(<App />);

		const candidateStepContainer = screen.getByTestId(DATA.candidate.step);

		expect(within(candidateStepContainer).queryByText("No hay candidatos")).not.toBeInTheDocument();

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

function mockInitialData() {
	window.localStorage.setItem("CANDIDATES", JSON.stringify([DATA.candidate]));
}

function clearData() {
	window.localStorage.clear();
}
