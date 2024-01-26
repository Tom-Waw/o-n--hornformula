import useAlgorithm from "@/api/useAlgorithm";
import useRunConfig from "@/run_config/useRunConfig";
import React, { useMemo } from "react";
import { Alert } from "react-bootstrap";
import AlgorithmStateBox from "./AlgorithmStateBox";
import MarkingVisualization from "./marking/MarkingVisualization";
import PebblingVisualization from "./pebbling/PebblingVisualization";

const visualizationMap: Record<string, React.FC> = {
	"Marking Algorithm": MarkingVisualization,
	"Pebbling Algorithm": PebblingVisualization,
	// Add other algorithms here
};

const AlgorithmVisualization: React.FC = () => {
	const { algorithm } = useRunConfig();
	const { data, error } = useAlgorithm();

	const Visualization = useMemo(() => visualizationMap[algorithm], [algorithm]);

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

	return (
		<>
			{renderExceptions() ?? (
				<>
					<Visualization />
					<AlgorithmStateBox />
				</>
			)}
		</>
	);
};

export default AlgorithmVisualization;
