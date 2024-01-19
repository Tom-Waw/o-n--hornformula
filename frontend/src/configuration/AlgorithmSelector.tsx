import api from "@/api";
import useRunConfig from "@/run_config/useRunConfig";
import React, { useEffect, useState } from "react";
import {
	Button,
	Col,
	Dropdown,
	DropdownButton,
	Form,
	Row,
} from "react-bootstrap";

const AlgorithmSelector: React.FC = () => {
	const [algorithms, setAlgorithms] = useState<string[]>([]);
	useEffect(() => {
		const fetchAlgorithms = async () => {
			const response = await api.get("/algorithms");
			if (response) setAlgorithms(response.data as string[]);
		};

		fetchAlgorithms();
	}, []);

	const {
		algorithm,
		isWalkthrough,
		setAlgorithm,
		setIsWalkthrough,
		setIsRunning,
	} = useRunConfig();

	useEffect(() => {
		if (!algorithms.includes(algorithm)) setAlgorithm(algorithms[0]);
	}, [algorithms, algorithm, setAlgorithm]);

	const onRunClick = async () => {
		setIsRunning(true);
	};

	return (
		<>
			<h2 className="mb-5">Algorithm Configuration</h2>
			<Row className="align-items-center">
				<Col md="auto" style={{ fontWeight: "bold", fontSize: "1.2em" }}>
					<span>Select Algorithm:</span>
				</Col>
				<Col md="auto">
					<DropdownButton
						title={algorithm || "Select"}
						variant="secondary"
						onSelect={(algo) => algo && setAlgorithm(algo)}
					>
						{algorithms.map((algo, idx) => (
							<Dropdown.Item key={idx} eventKey={algo}>
								{algo}
							</Dropdown.Item>
						))}
					</DropdownButton>
				</Col>
				<Col md="auto" className="ms-auto">
					<Form.Check
						type="switch"
						id="walkthrough-switch"
						label="Walkthrough Mode"
						checked={isWalkthrough}
						onChange={() => setIsWalkthrough(!isWalkthrough)}
					/>
				</Col>
				<Col md="auto">
					<Button onClick={onRunClick} variant="primary">
						Run
					</Button>
				</Col>
			</Row>
		</>
	);
};

export default AlgorithmSelector;
