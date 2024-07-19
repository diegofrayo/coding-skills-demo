import * as React from "react";
import { render, screen, fireEvent, within } from "../utils";
import App from "../../src/pages/home";

test("delete candidate", async () => {
	injectInitialData();
	render(<App />);

	await selectCandidateToDelete();
	await userClicksOnDeleteButton();
	await deleteCandidateExpects();
});

// --- STEPS ---

async function selectCandidateToDelete() {
	fireEvent.click(screen.getByTestId(DATA.candidateToDelete.id));
}

function userClicksOnDeleteButton() {
	const editCandidateDialog = screen.getByTestId("edit-candidate-dialog");

	fireEvent.click(
		within(editCandidateDialog).getByRole("button", {
			name: /eliminar/i,
		}),
	);
}

function deleteCandidateExpects() {
	/*
	 * DIALOG SHOULD BE HIDDEN
	 */
	expect(screen.getByTestId("edit-candidate-dialog")).not.toHaveAttribute("open");

	/*
	 * CANDIDATE CARD SHOULDN'T APPEAR IN THE BOARD
	 */
	expect(screen.queryByTestId(DATA.candidateToDelete.id)).not.toBeInTheDocument();
}

// --- DATA SETUP ---

const DATA = {
	candidateToDelete: {
		id: "diego-rayo",
		step: "entrevista-tecnica",
	},
};

function injectInitialData() {
	window.localStorage.setItem("CANDIDATES", JSON.stringify([DATA.candidateToDelete]));
}
