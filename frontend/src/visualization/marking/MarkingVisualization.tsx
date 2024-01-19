import { BaseAlgorithmState } from "@/api/useAlgorithm";
import useRunConfig from "@/run_config/useRunConfig";
import React from "react";
import { Col, Row } from "react-bootstrap";

export interface MarkingRunState extends BaseAlgorithmState {
	marked_literals: boolean[];
	solved_clauses: boolean[];
}

const MarkingVisualization: React.FC<MarkingRunState> = (data) => {
	const { formula } = useRunConfig();

	return (
		<Row className="justify-content-center">
			{formula.matrix.map((clause, i) => (
				<React.Fragment key={i}>
					{i > 0 && (
						<Col xs="auto">
							<h4> ∧ </h4>
						</Col>
					)}
					<Col xs="auto">
						<h4
							className={
								data.solved_clauses[i] ? "text-decoration-line-through" : ""
							}
						>
							(
							{clause.map((isUsed, j) => {
								const isFirstUsed = clause.findIndex((x) => x) === j;
								return (
									isUsed && (
										<React.Fragment key={j}>
											{!isFirstUsed && <span> v </span>}
											<LiteralSymbol
												index={j}
												isMarked={data.marked_literals[j]}
												isPositive={formula.heads[i] === j}
											/>
										</React.Fragment>
									)
								);
							})}
							)
						</h4>
					</Col>
				</React.Fragment>
			))}
		</Row>
	);
};

export default MarkingVisualization;

const LiteralSymbol: React.FC<{
	index: number;
	isMarked: boolean;
	isPositive: boolean;
}> = ({ index, isMarked, isPositive }) => {
	const literalStyle = isMarked ? { color: "blue", fontWeight: "bold" } : {};
	const prefix = !isPositive ? "¬" : "";
	return <span style={literalStyle}>{`${prefix}P${index}`}</span>;
};
