import useAlgorithm from "@/api/useAlgorithm";
import React, { useState } from "react";
import { Card, Collapse, Table } from "react-bootstrap";

const AlgorithmStateBox: React.FC = () => {
	const [open, setOpen] = useState(true);
	const { data } = useAlgorithm();

	// Function to capitalize the first letter of a string
	const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
	// Function to format the value for display
	const formatValue = (value: unknown) =>
		Array.isArray(value)
			? "[ " + value.join(", ") + " ]"
			: JSON.stringify(value);

	return (
		<Card className="mt-2">
			<Card.Header
				as="h5"
				onClick={() => setOpen(!open)}
				style={{ cursor: "pointer" }}
			>
				Algorithm State
			</Card.Header>
			<Collapse in={open}>
				<Card.Body>
					<Table striped bordered hover size="sm">
						<tbody>
							{Object.entries(data!).map(([key, value]) => (
								<tr key={key}>
									<th>{capitalize(key)}</th>
									<td>{formatValue(value)}</td>
								</tr>
							))}
						</tbody>
					</Table>
				</Card.Body>
			</Collapse>
		</Card>
	);
};

export default AlgorithmStateBox;
