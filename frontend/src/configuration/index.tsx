import useRunConfig from "@/run_config/useRunConfig";
import AlgorithmSelector from "./AlgorithmSelector";
import FormulaEditor from "./FormulaEditor";

const AlgorithmConfiguration = () => {
	const { algorithm, formula, isRunning } = useRunConfig();

	return (
		<>
			{!isRunning ? <FormulaEditor /> : <h4>{formula.toString()}</h4>}
			<hr className="my-5" />
			{!isRunning ? <AlgorithmSelector /> : <h2>{algorithm}</h2>}
		</>
	);
};

export default AlgorithmConfiguration;
