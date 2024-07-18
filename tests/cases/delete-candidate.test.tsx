import * as React from "react";
import { render, screen, fireEvent, getByText, within, queryByText } from "../utils";
import App from "../../src/pages/home";

test("delete candidate", async () => {
	mockInitialData();
	render(<App />);

	await userSelectsCandidateToDelete();
	await userClicksDeleteButton();
	await userExpectsDialogHidden();
	await userExpectsDoesntSeeTheCandidate();
});

// --- STEPS ---

const DATA = {
	candidateToDelete: {
		id: "diego-rayo",
		name: "Diego Rayo",
		comments: "Role: Frontend Developer",
		step: "entrevista-tecnica",
	},
};

async function userSelectsCandidateToDelete() {
	const candidateStepContainer = screen.getByTestId(DATA.candidateToDelete.step);

	expect(getByText(candidateStepContainer, DATA.candidateToDelete.name)).toBeInTheDocument();
	expect(getByText(candidateStepContainer, DATA.candidateToDelete.comments)).toBeInTheDocument();

	fireEvent.click(screen.getByTestId(DATA.candidateToDelete.id));
}

function userClicksDeleteButton() {
	const editCandidateDialog = screen.getByTestId("edit-candidate-dialog");

	fireEvent.click(
		within(editCandidateDialog).getByRole("button", {
			name: /eliminar/i,
		}),
	);
}

function userExpectsDialogHidden() {
	expect(screen.getByTestId("edit-candidate-dialog")).not.toHaveAttribute("open");
}

function userExpectsDoesntSeeTheCandidate() {
	const candidateStepContainer = screen.getByTestId(DATA.candidateToDelete.step);

	expect(queryByText(candidateStepContainer, DATA.candidateToDelete.name)).not.toBeInTheDocument();
	expect(
		queryByText(candidateStepContainer, DATA.candidateToDelete.comments),
	).not.toBeInTheDocument();
}

// --- MOCKS ---

function mockInitialData() {
	window.localStorage.setItem("CANDIDATES", JSON.stringify([DATA.candidateToDelete]));
}
