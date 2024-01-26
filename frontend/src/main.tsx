import { AlgorithmProvider } from "@/api/algorithmContext.tsx";
import { RunConfigProvider } from "@/run_config/runConfigContext.tsx";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

import "bootstrap/dist/css/bootstrap.min.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<RunConfigProvider>
			<AlgorithmProvider>
				<App />
			</AlgorithmProvider>
		</RunConfigProvider>
	</React.StrictMode>
);
