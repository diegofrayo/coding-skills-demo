import * as React from "react";
import { render, screen, fireEvent, within } from "../utils";
import App from "../../src/pages/home";

describe("move cards", () => {
	afterEach(() => {
		clearData();
	});

	it("to the right", async () => {
		injectInitialData("oferta");
		render(<App />);

		const prevCandidateStep = getCandidateStep();
		await clickOnMoveCardToTheRightButton();
		await expectsCandidateCardWasMoved({
			prevCandidateStep: prevCandidateStep,
			newCandidateStep: "asignacion",
		});
	});

	it("to the left", async () => {
		injectInitialData("entrevista-tecnica");
		render(<App />);

		const prevCandidateStep = getCandidateStep();
		await clickOnMoveCardToTheLeftButton();
		await expectsCandidateCardWasMoved({
			prevCandidateStep: prevCandidateStep,
			newCandidateStep: "entrevista-inicial",
		});
	});

	it("to the left from first step", async () => {
		injectInitialData("entrevista-inicial");
		render(<App />);

		const candidateStep = getCandidateStep();
		await clickOnMoveCardToTheLeftButton();
		await expectsCandidateCardWasNotMoved(candidateStep);
	});

	it("to the right from last step", async () => {
		injectInitialData("rechazo");
		render(<App />);

		const candidateStep = getCandidateStep();
		await clickOnMoveCardToTheRightButton();
		await expectsCandidateCardWasNotMoved(candidateStep);
	});
});

// --- STEPS ---

async function clickOnMoveCardToTheLeftButton() {
	const candidateCardContainer = screen.getByTestId(DATA.candidate.id);

	fireEvent.click(within(candidateCardContainer).getByTestId("btn-move-to-the-left"));
}

async function clickOnMoveCardToTheRightButton() {
	const candidateCardContainer = screen.getByTestId(DATA.candidate.id);

	fireEvent.click(within(candidateCardContainer).getByTestId("btn-move-to-the-right"));
}

async function expectsCandidateCardWasMoved({
	prevCandidateStep,
	newCandidateStep,
}: {
	prevCandidateStep: string;
	newCandidateStep: string;
}) {
	const currentCandidateStep = getCandidateStep();
	const prevCandidateStepContainer = screen.getByTestId(prevCandidateStep);
	const prevCandidateCardContainer = within(prevCandidateStepContainer).queryByTestId(
		DATA.candidate.id,
	);
	const nextCandidateStepContainer = screen.getByTestId(newCandidateStep);
	const nextCandidateCardContainer = within(nextCandidateStepContainer).queryByTestId(
		DATA.candidate.id,
	);

	/*
	 * CANDIDATE CARD SHOULDN'T BE RENDERED IN THE PREV STEP COLUMN
	 */
	expect(currentCandidateStep).not.equal(prevCandidateStep);
	expect(prevCandidateCardContainer).not.toBeInTheDocument();

	/*
	 * CANDIDATE CARD SHOULD BE RENDERED IN THE NEW STEP COLUMN
	 */
	expect(currentCandidateStep).equal(newCandidateStep);
	expect(nextCandidateCardContainer).toBeInTheDocument();
}

function expectsCandidateCardWasNotMoved(prevCandidateStep: string) {
	const currentCandidateStep = getCandidateStep();
	const candidateStepContainer = screen.getByTestId(currentCandidateStep);
	const candidateCardContainer = within(candidateStepContainer).queryByTestId(DATA.candidate.id);

	/*
	 * CANDIDATE CARD SHOULD BE RENDERED IN THE CURRENT STEP COLUMN
	 */
	expect(prevCandidateStep).equal(currentCandidateStep);
	expect(candidateCardContainer).toBeInTheDocument();
}

// --- DATA SETUP ---

const DATA = {
	candidate: {
		id: "diego-rayo",
		name: "Diego Rayo",
		comments: "Role: Frontend Developer",
		step: "entrevista-inicial",
	},
};

function injectInitialData(step: string) {
	window.localStorage.setItem("CANDIDATES", JSON.stringify([{ ...DATA.candidate, step }]));
}

function getCandidateStep() {
	return JSON.parse(window.localStorage.getItem("CANDIDATES") || "[]")[0].step;
}

function clearData() {
	window.localStorage.clear();
}
