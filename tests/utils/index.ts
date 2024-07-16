import { render } from "@testing-library/react";

const AllTheProviders = ({ children }) => {
	return children;
};

function customRender(ui, options) {
	return render(ui, {
		wrapper: AllTheProviders,
		...options,
	});
}

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
