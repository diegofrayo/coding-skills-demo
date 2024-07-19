import * as React from "react";
import { render, screen, fireEvent, getByLabelText, within, getByTestId } from "../utils";
import App from "../../src/pages/home";

describe("add candidate", () => {
	beforeEach(() => {
		clearData();
	});

	it("create a new candidate", async () => {
		render(<App />);

		await clickAddCandidateButton();
		await fillTheForm();
		await submitTheForm();
		await createANewCandidateExpects();
	});

	it("cancel and close the dialog", async () => {
		render(<App />);

		await clickAddCandidateButton();
		await closeDialog();
		await cancelAndCloseTheDialogExpects();
	});
});

// --- STEPS ---

async function clickAddCandidateButton() {
	fireEvent.click(
		screen.getByRole("button", {
			name: /agregar candidato/i,
		}),
	);
}

function fillTheForm() {
	const addCandidateDialog = screen.getByTestId("add-candidate-dialog");

	fireEvent.change(getByLabelText(addCandidateDialog, "Nombre"), {
		target: {
			value: DATA.newCandidate.name,
		},
	});
	fireEvent.change(getByLabelText(addCandidateDialog, "Comentarios"), {
		target: {
			value: DATA.newCandidate.comments,
		},
	});
}

function submitTheForm() {
	const addCandidateDialog = screen.getByTestId("add-candidate-dialog");

	fireEvent.click(
		within(addCandidateDialog).getByRole("button", {
			name: /agregar/i,
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

function createANewCandidateExpects() {
	/*
	 * DIALOG SHOULD BE HIDDEN
	 */
	expect(screen.getByTestId("add-candidate-dialog")).not.toHaveAttribute("open");

	/*
	 * NEW CANDIDATE SHOULD BE RENDERED ON THE FIRST COLUMN
	 */
	const candidateStepContainer = screen.getByTestId(DATA.newCandidate.step);

	expect(
		within(getByTestId(candidateStepContainer, DATA.newCandidate.id)).getByText(
			DATA.newCandidate.name,
		),
	).toBeInTheDocument();
	expect(
		within(getByTestId(candidateStepContainer, DATA.newCandidate.id)).getByText(
			DATA.newCandidate.comments,
		),
	).toBeInTheDocument();
}

function cancelAndCloseTheDialogExpects() {
	/*
	 * DIALOG SHOULD BE HIDDEN
	 */
	expect(screen.getByTestId("add-candidate-dialog")).not.toHaveAttribute("open");
}

// --- DATA SETUP ---

const DATA = {
	newCandidate: {
		id: "diego-rayo",
		name: "Diego Rayo",
		comments: "Role: Frontend Developer",
		step: "entrevista-inicial",
	},
};

function clearData() {
	window.localStorage.clear();
}
