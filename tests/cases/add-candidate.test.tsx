import * as React from "react";
import { render, screen, fireEvent, getByLabelText, getByText, within } from "../utils";
import App from "../../src/pages/home";

test("add candidate", async () => {
	render(<App />);

	await userOpensAddCandidateDialog();
	await userFillsTheForm();
	await userSubmitsTheForm();
	await userExpectsDialogHidden();
	await userExpectsSeeingTheNewCandidate();
});

test("close add candidate modal", async () => {
	render(<App />);

	await userOpensAddCandidateDialog();
	await userClosesDialog();
	await userExpectsDialogHidden();
});

// --- STEPS ---

const DATA = {
	newCandidate: {
		name: "Diego Rayo",
		comments: "Role: Frontend Developer",
		step: "entrevista-inicial",
	},
};

async function userOpensAddCandidateDialog() {
	fireEvent.click(
		screen.getByRole("button", {
			name: /agregar candidato/i,
		}),
	);
}

function userFillsTheForm() {
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

function userSubmitsTheForm() {
	const addCandidateDialog = screen.getByTestId("add-candidate-dialog");

	fireEvent.click(
		within(addCandidateDialog).getByRole("button", {
			name: /agregar/i,
		}),
	);
}

function userClosesDialog() {
	fireEvent.click(
		screen.getByRole("button", {
			name: /close/i,
		}),
	);
}

function userExpectsDialogHidden() {
	expect(screen.getByTestId("add-candidate-dialog")).not.toHaveAttribute("open");
}

function userExpectsSeeingTheNewCandidate() {
	const candidateStepContainer = screen.getByTestId(DATA.newCandidate.step);

	expect(getByText(candidateStepContainer, DATA.newCandidate.name)).toBeInTheDocument();
	expect(getByText(candidateStepContainer, DATA.newCandidate.comments)).toBeInTheDocument();
}
