import * as React from "react";
import { createHashRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/home";

const router = createHashRouter([
	{
		path: "/",
		Component: HomePage,
	},
]);

function App() {
	return <RouterProvider router={router} />;
}

export default App;
