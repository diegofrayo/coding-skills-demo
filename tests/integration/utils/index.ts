import * as React from "react";
import { render, type RenderOptions } from "@testing-library/react";

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
	return children;
};

function customRender(ui: React.ReactNode, options?: RenderOptions) {
	return render(ui, {
		wrapper: AllTheProviders,
		...options,
	});
}

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
