import useRunConfig from "@/run_config/useRunConfig";
import React from "react";
import { Button, Col, Dropdown, DropdownButton, Row } from "react-bootstrap";
import LiteralComponent from "./LiteralComponent";

interface ClauseComponentProps {
	clauseIndex: number;
}

const ClauseComponent: React.FC<ClauseComponentProps> = ({ clauseIndex }) => {
	const { formula, updateFormula } = useRunConfig();
	const clause = formula.matrix[clauseIndex];

	const onAddLiteral = (literalIndex = -1) => {
		updateFormula((f) => f.toggleLiteralUsage(clauseIndex, literalIndex));
	};

	const onRemoveClause = () => {
		updateFormula((f) => {
			f.deleteClause(clauseIndex);
			f.removeUnusedLiterals();
		});
	};

	return (
		<Row
			className="align-items-center mb-2 p-3"
			style={{ background: "lightgrey", borderRadius: "10px" }}
		>
			<Col>
				<div className="d-flex flex-wrap">
					{clause.map(
						(used, index) =>
							used && (
								<LiteralComponent
									key={index}
									clauseIndex={clauseIndex}
									literalIndex={index}
								/>
							)
					)}
				</div>
			</Col>
			<Col md="auto" className="ms-auto">
				<div className="d-flex align-items-center">
					<DropdownButton
						title="Add Literal"
						variant="secondary"
						className="me-2"
					>
						{clause.map(
							(used, index) =>
								!used && (
									<Dropdown.Item
										key={index}
										onClick={() => onAddLiteral(index)}
									>
										P<sub>{index}</sub>
									</Dropdown.Item>
								)
						)}
						<Dropdown.Item key={"new"} onClick={() => onAddLiteral()}>
							New
						</Dropdown.Item>
					</DropdownButton>
					<Button variant="danger" onClick={onRemoveClause}>
						Remove
					</Button>
				</div>
			</Col>
		</Row>
	);
};

export default ClauseComponent;
