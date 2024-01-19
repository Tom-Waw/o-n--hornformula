import useRunConfig from "@/run_config/useRunConfig";
import React from "react";

interface LiteralComponentProps {
	clauseIndex: number;
	literalIndex: number;
}

const LiteralComponent: React.FC<LiteralComponentProps> = ({
	clauseIndex,
	literalIndex,
}) => {
	const { formula, updateFormula } = useRunConfig();
	const prefix = formula.heads[clauseIndex] !== literalIndex ? "¬" : "";

	const onToggleHead = () => {
		updateFormula((f) => f.toogleHead(clauseIndex, literalIndex));
	};

	const onRemove = () => {
		updateFormula((f) => {
			f.toggleLiteralUsage(clauseIndex, literalIndex);
			f.removeEmptyClauses();
			f.removeUnusedLiterals();
		});
	};

	return (
		<div className="d-flex flex-column align-items-start me-3">
			<div
				style={{
					cursor: "pointer",
					color: "black",
					textAlign: "center",
					fontSize: "1.25rem",
					fontWeight: "bold",
				}}
				onClick={onToggleHead}
			>
				{prefix}P<sub>{literalIndex}</sub>
			</div>
			<div
				className="mt-2"
				style={{
					width: "100%",
					cursor: "pointer",
					color: "white",
					background: "grey",
					textAlign: "center",
					fontSize: "0.75rem",
				}}
				onClick={onRemove}
			>
				X
			</div>
		</div>
	);
};

export default LiteralComponent;
