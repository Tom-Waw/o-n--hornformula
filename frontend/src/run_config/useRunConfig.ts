import { useContext } from "react";
import { RunConfigContext } from "./runConfigContext";

const useRunConfig = () => {
	const context = useContext(RunConfigContext);
	if (!context) {
		throw new Error("useRunConfig must be used within a RunConfigProvider");
	}
	return context;
};

export default useRunConfig;
