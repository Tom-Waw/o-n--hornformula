import { RunConfigContextData } from "@/run_config/context";
import { useCallback, useState } from "react";
import api from ".";

export type BaseAlgorithmState = {
	is_completed: boolean;
	is_satisfiable: boolean | null;
};

export type ApiResponse = {
	data: BaseAlgorithmState | null;
	loading: boolean;
	error: Error | null;
};

function useAlgorithm() {
	const [response, setResponse] = useState<ApiResponse>({
		data: null,
		loading: false,
		error: null,
	});

	const fetchStep = useCallback(async () => {
		setResponse((prev) => ({ ...prev, loading: true }));
		try {
			const result = await api.get("/step");
			setResponse({
				data: result.data,
				loading: false,
				error: null,
			});
		} catch (error) {
			setResponse({ data: null, loading: false, error: error as Error });
		}
	}, []);

	const stop = useCallback(async () => {
		setResponse({
			data: null,
			loading: false,
			error: null,
		});
	}, []);

	const setup = useCallback(
		async ({ formula, algorithm, isWalkthrough }: RunConfigContextData) => {
			setResponse((prev) => ({ ...prev, loading: true }));
			try {
				await api.post("/setup", {
					formula: formula.serialize(),
					algorithm,
					isWalkthrough,
				});
				stop();
			} catch (error) {
				setResponse({ data: null, loading: false, error: error as Error });
			}
		},
		[stop]
	);

	return { ...response, fetchStep, setup, stop };
}

export default useAlgorithm;
