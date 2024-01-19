import useRunConfig from "@/run_config/useRunConfig";
import React, { useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import ClauseComponent from "./ClauseComponent";

const FormulaEditor: React.FC = () => {
	const { formula, updateFormula } = useRunConfig();
	const [randomLiteralCount, setRandomLiteralCount] = useState(6);

	const onAddClause = () => {
		updateFormula((f) => {
			f.removeEmptyClauses();
			f.addClause();
		});
	};

	const onRandomize = () => {
		updateFormula((f) => f.randomize(randomLiteralCount));
	};

	return (
		<Container className="text-center">
			<h2 className="mb-4">Horn Formula Builder</h2>
			{formula.matrix.length > 0 ? (
				formula.matrix.map((_, index) => (
					<ClauseComponent key={index} clauseIndex={index} />
				))
			) : (
				<Alert variant="info" className="mt-3">
					The formula is currently empty. Start by adding a clause.
				</Alert>
			)}
			<Row className="mt-4 justify-content-between">
				<Col xs="auto">
					<Button onClick={onAddClause} variant="primary">
						Add Clause
					</Button>
				</Col>
				<Col xs="auto" className="ml-auto d-flex justify-content-end">
					<Form.Control
						className="me-2"
						type="number"
						value={randomLiteralCount}
						onChange={(e) => setRandomLiteralCount(parseInt(e.target.value))}
						min={1}
					/>
					<Button onClick={onRandomize} variant="success">
						Randomize
					</Button>
				</Col>
			</Row>
		</Container>
	);
};

export default FormulaEditor;
