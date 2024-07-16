import { render, screen } from "../utils";
import App from "../../src/App.tsx";

test("add candidate", async () => {
	render(<App />);

	// ASSERT
	expect(screen.getByRole("button")).toHaveTextContent("Agregar candidato");
});
