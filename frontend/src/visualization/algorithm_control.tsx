import useAlgorithm from "@/api/useAlgorithm";
import useRunConfig from "@/run_config/useRunConfig";
import { Badge, Button, Col, Row, Spinner } from "react-bootstrap";

const AlgorithmControl = () => {
	const { formula, algorithm, isWalkthrough, setIsRunning } = useRunConfig();
	const { data, loading, error, fetchStep, setup, stop } = useAlgorithm();

	const onResetClick = async () => {
		await setup({ formula, algorithm, isWalkthrough });
		await fetchStep();
	};

	const onStopClick = () => {
		stop();
		setIsRunning(false);
	};

	return loading ? (
		<Spinner animation="border" role="status" className="my-4 mx-auto">
			<span className="visually-hidden">Loading...</span>
		</Spinner>
	) : (
		<Row className="justify-content-center my-4">
			{!error && data && data.is_satisfiable !== null && (
				<Col xs={12}>
					<Badge
						style={{
							fontSize: "1.2rem",
							fontWeight: "normal",
							padding: "11.5px",
							marginBottom: "1rem",
						}}
						bg={data.is_satisfiable ? "success" : "danger"}
					>
						Formula is {data.is_satisfiable ? "satisfiable" : "unsatisfiable"}
					</Badge>
				</Col>
			)}
			{error && (
				<Col xs={12} className="text-center text-danger">
					{error.message}
				</Col>
			)}
			<Col xs="auto">
				{data && !error ? (
					<Button
						variant="primary"
						onClick={fetchStep}
						disabled={loading || data.is_satisfiable !== null}
					>
						Next
					</Button>
				) : (
					<Button variant="success" onClick={onResetClick} disabled={loading}>
						Start
					</Button>
				)}
			</Col>
			<Col xs="auto">
				<Button variant="secondary" onClick={onResetClick} disabled={loading}>
					Reset
				</Button>
			</Col>
			<Col xs="auto">
				<Button variant="danger" onClick={onStopClick} disabled={loading}>
					Stop
				</Button>
			</Col>
		</Row>
	);
};

export default AlgorithmControl;
