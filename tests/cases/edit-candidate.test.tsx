import * as React from "react";
import { render, screen, fireEvent, getByLabelText, getByText, within } from "../utils";
import App from "../../src/pages/home";

test("edit candidate", async () => {
	mockInitialData();
	render(<App />);

	await userSelectsCandidateToEdit();
	await userUpdatesFormValues();
	await userSubmitsTheForm();
	await userExpectsDialogHidden();
	await userExpectsSeeingTheUpdatedCandidate();
});

// --- STEPS ---

const DATA = {
	candidateToEditBefore: {
		id: "diego-rayo",
		name: "Diego Rayo",
		comments: "Role: Frontend Developer",
		step: "entrevista-tecnica",
	},
	candidateToEditAfter: {
		id: "diego-rayo",
		name: "Diego Rayo Zamora",
		comments:
			"Role: Frontend Developer - Le fue bien en la entrevista inicial, interesante candidato",
		step: "entrevista-tecnica",
	},
};

async function userSelectsCandidateToEdit() {
	const candidateStepContainer = screen.getByTestId(DATA.candidateToEditBefore.step);

	expect(getByText(candidateStepContainer, DATA.candidateToEditBefore.name)).toBeInTheDocument();
	expect(
		getByText(candidateStepContainer, DATA.candidateToEditBefore.comments),
	).toBeInTheDocument();

	fireEvent.click(screen.getByTestId(DATA.candidateToEditBefore.id));
}

function userUpdatesFormValues() {
	const editCandidateDialog = screen.getByTestId("edit-candidate-dialog");

	fireEvent.change(getByLabelText(editCandidateDialog, "Nombre"), {
		target: {
			value: DATA.candidateToEditAfter.name,
		},
	});
	fireEvent.change(getByLabelText(editCandidateDialog, "Comentarios"), {
		target: {
			value: DATA.candidateToEditAfter.comments,
		},
	});
}

function userSubmitsTheForm() {
	const editCandidateDialog = screen.getByTestId("edit-candidate-dialog");

	fireEvent.click(
		within(editCandidateDialog).getByRole("button", {
			name: /editar/i,
		}),
	);
}

function userExpectsDialogHidden() {
	expect(screen.getByTestId("edit-candidate-dialog")).not.toHaveAttribute("open");
}

function userExpectsSeeingTheUpdatedCandidate() {
	const candidateStepContainer = screen.getByTestId(DATA.candidateToEditAfter.step);

	expect(getByText(candidateStepContainer, DATA.candidateToEditAfter.name)).toBeInTheDocument();
	expect(getByText(candidateStepContainer, DATA.candidateToEditAfter.comments)).toBeInTheDocument();
}

// --- MOCKS ---

function mockInitialData() {
	window.localStorage.setItem("CANDIDATES", JSON.stringify([DATA.candidateToEditBefore]));
}
