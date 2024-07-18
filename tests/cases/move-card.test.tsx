import * as React from "react";
import { render, screen, fireEvent, within } from "../utils";
import App from "../../src/pages/home";

describe("moving cards", () => {
	afterEach(() => {
		clearData();
	});

	it("move card to left from first step", async () => {
		mockInitialData("entrevista-inicial");
		render(<App />);

		const candidateStep = getCandidateStep();
		await userClicksPrevButton(candidateStep);
		await userExpectsCandidateCardDoesntMove(candidateStep);
	});

	it("move card to right from last step", async () => {
		mockInitialData("rechazo");
		render(<App />);

		const candidateStep = getCandidateStep();
		await userClicksNextButton(candidateStep);
		await userExpectsCandidateCardDoesntMove(candidateStep);
	});

	it("move card to right", async () => {
		mockInitialData("oferta");
		render(<App />);

		const candidateStep = getCandidateStep();
		await userClicksNextButton(candidateStep);
		await userExpectsCandidateCardMoved(candidateStep, "asignacion");
	});

	it("move card to left", async () => {
		mockInitialData("entrevista-tecnica");
		render(<App />);

		const candidateStep = getCandidateStep();
		await userClicksPrevButton(candidateStep);
		await userExpectsCandidateCardMoved(candidateStep, "entrevista-inicial");
	});
});

// --- STEPS ---

const DATA = {
	candidate: {
		id: "diego-rayo",
		name: "Diego Rayo",
		comments: "Role: Frontend Developer",
		step: "entrevista-inicial",
	},
};

async function userClicksPrevButton(candidateStep: string) {
	const candidateStepContainer = screen.getByTestId(candidateStep);
	const candidateCardContainer = within(candidateStepContainer).getByTestId(DATA.candidate.id);

	fireEvent.click(within(candidateCardContainer).getByTestId("prev-button"));
}

function userExpectsCandidateCardDoesntMove(prevCandidateStep: string) {
	const currentCandidateStep = getCandidateStep();
	const candidateStepContainer = screen.getByTestId(currentCandidateStep);
	const candidateCardContainer = within(candidateStepContainer).queryByTestId(DATA.candidate.id);

	expect(prevCandidateStep).equal(currentCandidateStep);
	expect(candidateCardContainer).toBeInTheDocument();
}

async function userClicksNextButton(candidateStep: string) {
	const candidateStepContainer = screen.getByTestId(candidateStep);
	const candidateCardContainer = within(candidateStepContainer).getByTestId(DATA.candidate.id);

	fireEvent.click(within(candidateCardContainer).getByTestId("next-button"));
}

async function userExpectsCandidateCardMoved(prevStep: string, nextStep: string) {
	const currentCandidateStep = getCandidateStep();
	const prevCandidateStepContainer = screen.getByTestId(prevStep);
	const prevCandidateCardContainer = within(prevCandidateStepContainer).queryByTestId(
		DATA.candidate.id,
	);
	const nextCandidateStepContainer = screen.getByTestId(nextStep);
	const nextCandidateCardContainer = within(nextCandidateStepContainer).queryByTestId(
		DATA.candidate.id,
	);

	expect(currentCandidateStep).not.equal(prevStep);
	expect(prevCandidateCardContainer).not.toBeInTheDocument();

	expect(currentCandidateStep).equal(nextStep);
	expect(nextCandidateCardContainer).toBeInTheDocument();
}

// --- MOCKS ---

function mockInitialData(step: string) {
	window.localStorage.setItem("CANDIDATES", JSON.stringify([{ ...DATA.candidate, step }]));
}

function clearData() {
	window.localStorage.clear();
}

function getCandidateStep() {
	return JSON.parse(window.localStorage.getItem("CANDIDATES") || "[]")[0].step;
}
