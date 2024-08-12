describe("board", () => {
	beforeEach(() => {
		injectInitialData();
	});

	afterEach(() => {
		clearData();
	});

	it("add candidate button only appears in the first column", async () => {
		renderApp();

		/*
		 * BUTTON ONLY SHOULD APPEAR IN THE FIRST COLUMN
		 */
		cy.findByTestId(DATA.steps[0])
			.findByRole("button", { name: /agregar candidato/i })
			.should("exist");

		/*
		 * ONLY SHOULD EXIST ONE ADD CANDIDATE BUTTON
		 */
		cy.findByRole("button", {
			name: /agregar candidato/i,
		}).should("exist");
	});

	it("board has five columns", async () => {
		renderApp();

		/*
		 * CHECK IF STEP CONTAINER EXIST
		 */
		DATA.steps.forEach((step) => {
			cy.findByTestId(step).should("exist");
		});

		/*
		 * CHECK IF NUMBER OF COLUMNS IS EQUALS TO NUMBER OF STEPS
		 */
		cy.get(".step-container").should("have.length", DATA.steps.length);
	});

	it("'there is no candidates' message appears when a step doesn't have candidates", async () => {
		renderApp();

		/*
		 * THE MESSAGE DOES NOT APPEAR IN A COLUMN WITH CANDIDATES
		 */
		const candidateStepContainer = cy.findByTestId(DATA.candidate.step);

		candidateStepContainer.findByText("No hay candidatos").should("not.exist");

		/*
		 * THE MESSAGE APPEAR IN A COLUMN WITHOUT CANDIDATES
		 */
		const anotherEmptyStepContainer = cy.findByTestId(DATA.steps[2]);

		anotherEmptyStepContainer.findByText("No hay candidatos").should("exist");
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

function renderApp() {
	cy.visit("http://localhost:5173");
}
