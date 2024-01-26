import { RunConfigType } from "@/run_config/runConfigContext";
import { ReactNode, createContext, useCallback, useState } from "react";
import api from ".";

export interface BaseAlgorithmState {
	is_completed: boolean;
	is_satisfiable: boolean | null;
}

export interface ApiResponse {
	data: BaseAlgorithmState | null;
	loading: boolean;
	error: Error | null;
}

export interface AlgorithmContextType extends ApiResponse {
	fetchStep: () => Promise<void>;
	setup: (config: RunConfigType) => Promise<void>;
	stop: () => Promise<void>;
}

export const AlgorithmContext = createContext<AlgorithmContextType | undefined>(
	undefined
);

export const AlgorithmProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
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
		async ({ formula, algorithm, isWalkthrough }: RunConfigType) => {
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

	const value = {
		...response,
		fetchStep,
		setup,
		stop,
	};

	return (
		<AlgorithmContext.Provider value={value}>
			{children}
		</AlgorithmContext.Provider>
	);
};
