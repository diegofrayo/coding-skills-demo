import * as React from "react";
import { toKebabCase } from "js-convert-case";

function HomePage() {
	// --- STATES & REFS ---
	const [candidates, setCandidates] = React.useState<Candidate[] | undefined>(undefined);
	const [candidateToEdit, setCandidateToEdit] = React.useState<Candidate | undefined>(undefined);
	const addCandidateDialogRef = React.useRef<HTMLDialogElement>(null);
	const editCandidateDialogRef = React.useRef<HTMLDialogElement>(null);

	// --- EFFECTS ---
	React.useEffect(
		function loadCandidates() {
			if (candidates === undefined) {
				const candidatesSaved = JSON.parse(
					window.localStorage.getItem("CANDIDATES") || "[]",
				) as Candidate[];

				setCandidates(candidatesSaved);
			} else {
				window.localStorage.setItem("CANDIDATES", JSON.stringify(candidates));
			}
		},
		[candidates, setCandidates],
	);

	// --- HANDLERS ---
	function handleMoveCandidateToPrevStepClick(candidate: Candidate) {
		return function innerHandleMoveCandidateToPrevStepClick(
			event: React.MouseEvent<HTMLButtonElement>,
		) {
			event.stopPropagation();

			const index = STEPS.findIndex((step) => {
				return step.id === candidate.step;
			});

			if (index === 0) return;

			const nextStep = STEPS[index - 1];

			setCandidates(
				candidates?.map((item) => {
					if (item.id === candidate.id) {
						return {
							...item,
							step: nextStep.id,
						};
					}

					return item;
				}),
			);
		};
	}

	function handleMoveCandidateToNextStepClick(candidate: Candidate) {
		return function innerHandleMoveCandidateToNextStepClick(
			event: React.MouseEvent<HTMLButtonElement>,
		) {
			event.stopPropagation();

			const index = STEPS.findIndex((step) => {
				return step.id === candidate.step;
			});

			if (index === STEPS.length - 1) return;

			const nextStep = STEPS[index + 1];

			setCandidates(
				candidates?.map((item) => {
					if (item.id === candidate.id) {
						return {
							...item,
							step: nextStep.id,
						};
					}

					return item;
				}),
			);
		};
	}

	function handleAddCandidateClick() {
		getDialogRef(addCandidateDialogRef).showModal();
	}

	function handleCloseModalClick(dialogRef: React.RefObject<HTMLDialogElement | null>) {
		return function innerHandleCloseModalClick() {
			setCandidateToEdit(undefined);
			getDialogRef(dialogRef).close();
		};
	}

	function handleAddCandidateSubmit(event: React.FormEvent) {
		event.preventDefault();

		const formElement = event.currentTarget as HTMLFormElement;
		const formData = new FormData(formElement);

		setCandidates(
			candidates?.concat([
				{
					id: toKebabCase(formData.get("add-candidate-name")?.toString() || ""),
					step: "entrevista-inicial",
					name: formData.get("add-candidate-name")?.toString() || "",
					comments: formData.get("add-candidate-comments")?.toString() || "",
				},
			]),
		);

		getDialogRef(addCandidateDialogRef).close();
	}

	function handleEditCandidateSubmit(candidateId: Candidate["id"]) {
		return function innerHandleEditCandidateSubmit(event: React.FormEvent) {
			event.preventDefault();

			const formElement = event.currentTarget as HTMLFormElement;
			const formData = new FormData(formElement);

			setCandidates(
				candidates?.map((item) => {
					if (item.id === candidateId) {
						return {
							...item,
							name: formData.get("edit-candidate-name")?.toString() || "",
							comments: formData.get("edit-candidate-comments")?.toString() || "",
						};
					}

					return item;
				}),
			);

			handleCloseModalClick(editCandidateDialogRef)();
		};
	}

	function handleShowEditCandidateDialogClick(candidateId: Candidate["id"]) {
		return function innerHandleShowEditCandidateDialogClick() {
			setCandidateToEdit(candidates?.find((item) => item.id === candidateId));
			getDialogRef(editCandidateDialogRef).showModal();
		};
	}

	function handleDeleteCandidateClick(candidateId: Candidate["id"]) {
		return function innerHandleDeleteCandidateClick() {
			setCandidates(candidates?.filter((item) => item.id !== candidateId));
			handleCloseModalClick(editCandidateDialogRef)();
		};
	}

	// --- UTILS ---
	function filterCandidatesByStep(stepId: Step["id"]) {
		return candidates?.filter((candidate) => {
			return candidate.step === stepId;
		});
	}

	function getDialogRef(dialogRef: React.RefObject<HTMLDialogElement | null>) {
		const dialogElement = dialogRef.current;

		if (!dialogElement) {
			throw new Error("Invalid dialog ref");
		}

		return dialogElement;
	}

	if (candidates === undefined) {
		return null;
	}

	return (
		<main className="tw-p-3 tw-overflow-scroll tw-max-w-full tw-min-h-screen">
			<div className="tw-flex tw-flex-nowrap tw-gap-3">
				{STEPS.map((step) => {
					const candidates = filterCandidatesByStep(step.id);

					return (
						<section
							key={step.id}
							data-testid={step.id}
							className="step-container tw-bg-[#EBECF0] tw-px-3 tw-pt-4 tw-pb-3 tw-min-w-96"
						>
							<h2 className="tw-font-bold tw-text-2xl tw-mb-5">{step.name}</h2>

							<div>
								{candidates?.length === 0 ? (
									<p className="tw-text-[#717D8F] tw-text-center tw-p-5">No hay candidatos</p>
								) : (
									<div>
										{candidates?.map((candidate) => {
											return (
												<div
													key={candidate.id}
													data-testid={candidate.id}
													className="tw-p-3 tw-flex tw-justify-between tw-bg-white tw-mb-1 last:tw-mb-0 tw-cursor-pointer"
													onClick={handleShowEditCandidateDialogClick(candidate.id)}
												>
													<div>
														<p>{candidate.name}</p>
														<p className="tw-text-[#717D8F]">{candidate.comments}</p>
													</div>
													<div>
														<button
															data-testid="prev-button"
															className="tw-bg-[#EFEFEF] tw-w-7 tw-text-xs tw-rounded-sm tw-h-6 tw-border tw-border-[#969798]"
															onClick={handleMoveCandidateToPrevStepClick(candidate)}
														>
															{"<"}
														</button>
														<button
															data-testid="next-button"
															className="tw-bg-[#EFEFEF] tw-w-7 tw-text-xs tw-rounded-sm tw-h-6 tw-border tw-border-[#969798]"
															onClick={handleMoveCandidateToNextStepClick(candidate)}
														>
															{">"}
														</button>
													</div>
												</div>
											);
										})}
									</div>
								)}
							</div>

							{step.name === "Entrevista inicial" ? (
								<button
									className="tw-text-center tw-block tw-border tw-border-[#969798] tw-w-full tw-mt-3 tw-rounded-sm"
									onClick={handleAddCandidateClick}
								>
									Agregar candidato
								</button>
							) : null}
						</section>
					);
				})}
			</div>

			<AddCandidateDialog
				dialogRef={addCandidateDialogRef}
				handleCloseModalClick={handleCloseModalClick(addCandidateDialogRef)}
				handleAddCandidateSubmit={handleAddCandidateSubmit}
			/>

			<EditCandidateDialog
				dialogRef={editCandidateDialogRef}
				candidate={candidateToEdit}
				handleCloseModalClick={handleCloseModalClick(editCandidateDialogRef)}
				handleEditCandidateSubmit={handleEditCandidateSubmit}
				handleDeleteCandidateClick={handleDeleteCandidateClick}
			/>
		</main>
	);
}

export default HomePage;

// --- TYPES ---

type Step = (typeof STEPS)[number];

type Candidate = {
	id: string;
	name: string;
	step: Step["id"];
	comments: string;
};

// --- DATA ---

const STEPS = [
	{ id: "entrevista-inicial", name: "Entrevista inicial" },
	{ id: "entrevista-tecnica", name: "Entrevista técnica" },
	{ id: "oferta", name: "Oferta" },
	{ id: "asignacion", name: "Asignación" },
	{ id: "rechazo", name: "Rechazo" },
] as const;

// --- COMPONENTS ---

type T_AddCandidateDialogProps = {
	dialogRef: React.Ref<HTMLDialogElement>;
	handleCloseModalClick: () => void;
	handleAddCandidateSubmit: (event: React.FormEvent) => void;
};

function AddCandidateDialog({
	dialogRef,
	handleCloseModalClick,
	handleAddCandidateSubmit,
}: T_AddCandidateDialogProps) {
	return (
		<dialog
			data-testid="add-candidate-dialog"
			className="tw-p-4 tw-border backdrop:tw-backdrop-blur-sm tw-relative tw-pt-16 tw-pb-4 tw-max-w-full tw-w-96 tw-mx-auto"
			ref={dialogRef}
		>
			<button
				className="tw-absolute tw-top-1 tw-right-4 tw-text-3xl"
				aria-label="Close"
				onClick={handleCloseModalClick}
			>
				x
			</button>
			<h2 className="tw-text-2xl tw-font-bold tw-text-center tw-mb-6">Agregar candidato</h2>
			<form onSubmit={handleAddCandidateSubmit}>
				<label htmlFor="add-candidate-name">
					<p className="tw-font-bold tw-cursor-pointer">Nombre</p>
					<input
						id="add-candidate-name"
						name="add-candidate-name"
						type="text"
						placeholder="Nombre"
						className="tw-w-full tw-mb-3 tw-border tw-p-2"
					/>
				</label>

				<label htmlFor="add-candidate-comments">
					<p className="tw-font-bold tw-cursor-pointer">Comentarios</p>
					<textarea
						id="add-candidate-comments"
						name="add-candidate-comments"
						placeholder="Comentarios"
						className="tw-w-full tw-mb-3 tw-border tw-p-2"
					/>
				</label>

				<button
					type="submit"
					className="tw-text-center tw-block tw-border tw-border-[#969798] tw-w-full tw-rounded-sm"
				>
					Agregar
				</button>
			</form>
		</dialog>
	);
}

type T_EditCandidateDialogProps = {
	dialogRef: React.Ref<HTMLDialogElement>;
	candidate: Candidate | undefined;
	handleCloseModalClick: () => void;
	handleEditCandidateSubmit: (candidateId: Candidate["id"]) => (event: React.FormEvent) => void;
	handleDeleteCandidateClick: (candidateId: Candidate["id"]) => (event: React.FormEvent) => void;
};

function EditCandidateDialog({
	dialogRef,
	candidate,
	handleCloseModalClick,
	handleEditCandidateSubmit,
	handleDeleteCandidateClick,
}: T_EditCandidateDialogProps) {
	return (
		<dialog
			data-testid="edit-candidate-dialog"
			className="tw-p-4 tw-border backdrop:tw-backdrop-blur-sm tw-relative tw-pt-16 tw-pb-4 tw-max-w-full tw-w-96 tw-mx-auto"
			ref={dialogRef}
		>
			<button
				className="tw-absolute tw-top-1 tw-right-4 tw-text-3xl"
				aria-label="Close"
				onClick={handleCloseModalClick}
			>
				x
			</button>
			<h2 className="tw-text-2xl tw-font-bold tw-text-center tw-mb-6">Editar candidato</h2>
			<form onSubmit={handleEditCandidateSubmit(candidate?.id || "")}>
				<label htmlFor="edit-candidate-name">
					<p className="tw-font-bold tw-cursor-pointer">Nombre</p>
					<input
						id="edit-candidate-name"
						name="edit-candidate-name"
						type="text"
						placeholder="Nombre"
						className="tw-w-full tw-mb-3 tw-border tw-p-2"
						defaultValue={candidate?.name || ""}
					/>
				</label>

				<label htmlFor="edit-candidate-comments">
					<p className="tw-font-bold tw-cursor-pointer">Comentarios</p>
					<textarea
						id="edit-candidate-comments"
						name="edit-candidate-comments"
						placeholder="Comentarios"
						className="tw-w-full tw-mb-3 tw-border tw-p-2"
						defaultValue={candidate?.comments || ""}
					/>
				</label>
				<button className="tw-text-center tw-block tw-border tw-border-[#969798] tw-w-full tw-rounded-sm">
					Editar
				</button>
			</form>
			<button
				className="tw-text-center tw-block  tw-w-full tw-rounded-sm tw-text-white tw-bg-red-500 tw-mt-1"
				onClick={handleDeleteCandidateClick(candidate?.id || "")}
			>
				Eliminar
			</button>
		</dialog>
	);
}
