import { RunConfigProvider } from "@/run_config/context";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

import "bootstrap/dist/css/bootstrap.min.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<RunConfigProvider>
			<App />
		</RunConfigProvider>
	</React.StrictMode>
);
