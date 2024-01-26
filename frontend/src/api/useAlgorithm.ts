import { useContext } from "react";
import { AlgorithmContext, BaseAlgorithmState } from "./algorithmContext";

const useAlgorithm = <T extends BaseAlgorithmState>() => {
	const context = useContext(AlgorithmContext);
	if (!context) {
		throw new Error("useAlgorithm must be used within an AlgorithmProvider");
	}
	return {
		...context,
		data: context.data as T | null,
	};
};

export default useAlgorithm;
