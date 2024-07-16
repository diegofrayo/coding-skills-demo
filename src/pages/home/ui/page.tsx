import * as React from "react";

function HomePage() {
	// --- STATES & REFS ---
	const [candidates, setCandidates] = React.useState<Candidate[] | undefined>(undefined);
	const dialogRef = React.useRef<HTMLDialogElement>(null);

	// --- EFFECTS ---
	React.useEffect(
		function loadCandidates() {
			if (candidates === undefined) {
				const candidatesSaved = (
					window.localStorage.getItem("CANDIDATES")
						? JSON.parse(window.localStorage.getItem("CANDIDATES") || "")
						: CANDIDATES
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
		return function innerHandleMoveCandidateToPrevStepClick() {
			const index = STEPS.findIndex((step) => {
				return step.name === candidate.step;
			});

			if (index === 0) return;

			const nextStep = STEPS[index - 1];

			setCandidates(
				candidates?.map((item) => {
					if (item.id === candidate.id) {
						return {
							...item,
							step: nextStep.name,
						};
					}

					return item;
				}),
			);
		};
	}

	function handleMoveCandidateToNextStepClick(candidate: Candidate) {
		return function innerHandleMoveCandidateToNextStepClick() {
			const index = STEPS.findIndex((step) => {
				return step.name === candidate.step;
			});

			if (index === STEPS.length - 1) return;

			const nextStep = STEPS[index + 1];

			setCandidates(
				candidates?.map((item) => {
					if (item.id === candidate.id) {
						return {
							...item,
							step: nextStep.name,
						};
					}

					return item;
				}),
			);
		};
	}

	function handleAddCandidateClick() {
		getDialogRef().showModal();
	}

	function handleCloseModalClick() {
		getDialogRef().close();
	}

	function handleAddCandidateSubmit(event: React.FormEvent) {
		event.preventDefault();

		const formElement = event.currentTarget as HTMLFormElement;

		setCandidates(
			candidates?.concat([
				{
					id: (formElement["candidate-name"].value || "").toLowerCase(),
					name: formElement["candidate-name"].value || "",
					step: "Entrevista inicial",
					comments: formElement["candidate-comments"].value,
				},
			]),
		);

		getDialogRef().close();
	}

	// --- UTILS ---
	function filterCandidatesByStep(stepName: Step["name"]) {
		return candidates?.filter((candidate) => {
			return candidate.step === stepName;
		});
	}

	function getDialogRef() {
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
		<main className="tw-p-3 tw-overflow-auto">
			<div className="tw-flex tw-flex-nowrap tw-gap-3">
				{STEPS.map((step) => {
					const candidates = filterCandidatesByStep(step.name);

					return (
						<section
							key={step.id}
							className="tw-bg-[#EBECF0] tw-px-3 tw-pt-4 tw-pb-3 tw-min-w-96"
						>
							<h2 className="tw-font-bold tw-text-2xl tw-mb-5">{step.name}</h2>

							<div>
								{candidates?.length === 0 ? (
									<p className="tw-text-[#717D8F] tw-text-center tw-p-5">No hay candidatos</p>
								) : (
									<div className="">
										{candidates?.map((candidate) => {
											return (
												<div
													key={candidate.id}
													className="tw-p-3 tw-flex tw-justify-between tw-bg-white tw-mb-1 last:tw-mb-0"
												>
													<div>
														<p>{candidate.name}</p>
														<p className="tw-text-[#717D8F]">{candidate.comments}</p>
													</div>
													<div>
														<button
															className="tw-bg-[#EFEFEF] tw-w-7 tw-text-xs tw-rounded-sm tw-h-6 tw-border tw-border-[#969798]"
															onClick={handleMoveCandidateToPrevStepClick(candidate)}
														>
															{"<"}
														</button>
														<button
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

			<dialog
				className="tw-p-4 tw-border backdrop:tw-backdrop-blur-sm tw-relative tw-pt-16 tw-pb-4"
				ref={dialogRef}
			>
				<button
					className="tw-absolute tw-top-1 tw-right-4 tw-text-3xl"
					onClick={handleCloseModalClick}
				>
					x
				</button>
				<h2 className="tw-text-2xl tw-font-bold tw-text-center tw-mb-6">Agregar candidato</h2>
				<form onSubmit={handleAddCandidateSubmit}>
					<input
						type="text"
						name="candidate-name"
						placeholder="Nombre"
						className="tw-w-full tw-mb-2 tw-border tw-p-2"
					/>
					<textarea
						name="candidate-comments"
						placeholder="Comentarios"
						className="tw-w-full tw-mb-2 tw-border tw-p-2"
					/>
					<button className="tw-text-center tw-block tw-border tw-border-[#969798] tw-w-full tw-rounded-sm">
						Agregar
					</button>
				</form>
			</dialog>
		</main>
	);
}

export default HomePage;

// --- TYPES ---

type Step = (typeof STEPS)[number];

type Candidate = {
	id: string;
	name: string;
	step: Step["name"];
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

const CANDIDATES = [
	{
		id: "goncy",
		name: "Gonzalo Pozzo",
		step: "Entrevista técnica",
		comments: "Medio pelo",
	},
	{
		id: "doe",
		name: "John Doe",
		step: "Entrevista inicial",
		comments: "",
	},
];
