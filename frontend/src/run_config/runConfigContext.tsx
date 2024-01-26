import HornFormula from "@/configuration/HornFormula";
import React, { ReactNode, createContext, useState } from "react";

export interface RunConfigType {
	formula: HornFormula;
	algorithm: string;
	isWalkthrough: boolean;
}

export interface RunConfigContextType extends RunConfigType {
	updateFormula: (updateFn: (formula: HornFormula) => void) => void;
	setAlgorithm: (algorithm: string) => void;
	setIsWalkthrough: (isWalkthrough: boolean) => void;
	isRunning: boolean;
	setIsRunning: (isRunning: boolean) => void;
}

export const RunConfigContext = createContext<RunConfigContextType | undefined>(
	undefined
);

export const RunConfigProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [formula, setFormula] = useState(new HornFormula());
	const [algorithm, setAlgorithm] = useState("");
	const [isWalkthrough, setIsWalkthrough] = useState(true);
	const [isRunning, setIsRunning] = useState(false);

	const updateFormula = (updateFn: (formula: HornFormula) => void) => {
		setFormula((prevFormula) => {
			const newFormula = prevFormula.copy();
			updateFn(newFormula);
			return newFormula;
		});
	};

	const contextValue = {
		formula,
		updateFormula,
		algorithm,
		setAlgorithm,
		isWalkthrough,
		setIsWalkthrough,
		isRunning,
		setIsRunning,
	};

	return (
		<RunConfigContext.Provider value={contextValue}>
			{children}
		</RunConfigContext.Provider>
	);
};
