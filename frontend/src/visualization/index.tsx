import useAlgorithm, { BaseAlgorithmState } from "@/api/useAlgorithm";
import useRunConfig from "@/run_config/useRunConfig";
import React, { useMemo } from "react";
import { Alert, Badge, Button, Col, Row, Spinner } from "react-bootstrap";
import AlgorithmStateBox from "./AlgorithmStateBox";
import MarkingVisualization from "./marking/MarkingVisualization";
import PebblingVisualization from "./pebbling/PebblingVisualization";

const visualizationMap: Record<string, unknown> = {
	"Marking Algorithm": MarkingVisualization,
	"Pebbling Algorithm": PebblingVisualization,
	// Add other algorithms here
};

const AlgorithmVisualization: React.FC = () => {
	const { formula, algorithm, isWalkthrough, setIsRunning } = useRunConfig();
	const { data, loading, error, fetchStep, setup, stop } = useAlgorithm();

	const Visualization = useMemo(
		() => visualizationMap[algorithm] as React.FC<BaseAlgorithmState>,
		[algorithm]
	);

	const renderExceptions = () => {
		if (error) {
			return <Alert variant="danger">Error: {error.message}</Alert>;
		}

		if (!Visualization) {
			return (
				<Alert variant="danger">
					Visualization for "{algorithm}" not implemented.
				</Alert>
			);
		}

		if (!data) {
			return (
				<Alert variant="success">
					Start the algorithm to see the visualization.
				</Alert>
			);
		}
	};

	const onResetClick = async () => {
		await setup({ formula, algorithm, isWalkthrough });
		await fetchStep();
	};

	const onStopClick = () => {
		stop();
		setIsRunning(false);
	};

	return (
		<>
			{renderExceptions() ??
				(data && (
					<>
						{data.is_satisfiable !== null && (
							<div className="pb-4">
								<Badge
									style={{
										fontSize: "1.2rem",
										fontWeight: "normal",
										padding: "11.5px",
									}}
									bg={data.is_satisfiable ? "success" : "danger"}
								>
									Formula is{" "}
									{data.is_satisfiable ? "satisfiable" : "unsatisfiable"}
								</Badge>
							</div>
						)}
						<Visualization {...data} />
						<AlgorithmStateBox {...data} />
					</>
				))}

			<div className="mt-4">
				<Row className="mt-3 justify-content-center">
					{loading && (
						<Col xs="auto">
							<Spinner animation="border" role="status">
								<span className="visually-hidden">Loading...</span>
							</Spinner>
						</Col>
					)}
					<Col xs="auto">
						{data ? (
							<Button
								variant="primary"
								onClick={fetchStep}
								disabled={loading || data.is_satisfiable !== null}
							>
								Next
							</Button>
						) : (
							<Button
								variant="success"
								onClick={onResetClick}
								disabled={loading}
							>
								Start
							</Button>
						)}
					</Col>
					<Col xs="auto">
						<Button
							variant="secondary"
							onClick={onResetClick}
							disabled={loading}
						>
							Reset
						</Button>
					</Col>
					<Col xs="auto">
						<Button variant="danger" onClick={onStopClick} disabled={loading}>
							Stop
						</Button>
					</Col>
				</Row>
			</div>
		</>
	);
};

export default AlgorithmVisualization;
