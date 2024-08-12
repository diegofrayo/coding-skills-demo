import * as React from "react";
import { render, screen, fireEvent, getByLabelText, within, getByTestId } from "../utils";
import App from "../../../src/pages/home";

describe("edit candidate", () => {
	beforeAll(() => {
		injectInitialData();
	});

	test("update a candidate info", async () => {
		render(<App />);

		await selectCandidateToEdit();
		await updateFormValues();
		await submitTheForm();
		await updateACandidateInfoExpects();
	});

	it("cancel and close the dialog", async () => {
		render(<App />);

		await selectCandidateToEdit();
		await closeDialog();
		await cancelAndCloseTheDialogExpects();
	});
});

// --- STEPS ---

async function selectCandidateToEdit() {
	fireEvent.click(screen.getByTestId(DATA.candidateToEditBefore.id));
}

function updateFormValues() {
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

function submitTheForm() {
	const editCandidateDialog = screen.getByTestId("edit-candidate-dialog");

	fireEvent.click(
		within(editCandidateDialog).getByRole("button", {
			name: /editar/i,
		}),
	);
}

function closeDialog() {
	fireEvent.click(
		screen.getByRole("button", {
			name: /close/i,
		}),
	);
}

function updateACandidateInfoExpects() {
	/*
	 * DIALOG SHOULD BE HIDDEN
	 */
	expect(screen.getByTestId("edit-candidate-dialog")).not.toHaveAttribute("open");

	/*
	 * USER SHOULD BE ABLE TO SEE THE NEW CANDIDATE INFO
	 */
	const candidateStepContainer = screen.getByTestId(DATA.candidateToEditAfter.step);

	expect(
		within(getByTestId(candidateStepContainer, DATA.candidateToEditAfter.id)).getByText(
			DATA.candidateToEditAfter.name,
		),
	).toBeInTheDocument();
	expect(
		within(getByTestId(candidateStepContainer, DATA.candidateToEditAfter.id)).getByText(
			DATA.candidateToEditAfter.comments,
		),
	).toBeInTheDocument();
}

function cancelAndCloseTheDialogExpects() {
	/*
	 * DIALOG SHOULD BE HIDDEN
	 */
	expect(screen.getByTestId("edit-candidate-dialog")).not.toHaveAttribute("open");
}

// --- DATA SETUP ---

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

function injectInitialData() {
	window.localStorage.setItem("CANDIDATES", JSON.stringify([DATA.candidateToEditBefore]));
}
