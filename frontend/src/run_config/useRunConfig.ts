import { RunConfigContext } from "@/run_config/context";
import { useContext } from "react";

const useRunConfig = () => {
	const context = useContext(RunConfigContext);
	if (!context) {
		throw new Error("useRunConfig must be used within a RunConfigProvider");
	}
	return context;
};

export default useRunConfig;
