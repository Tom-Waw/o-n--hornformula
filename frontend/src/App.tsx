import useRunConfig from "@/run_config/useRunConfig";
import { Container, Navbar } from "react-bootstrap";
import AlgorithmSelector from "./configuration/AlgorithmSelector";
import FormulaEditor from "./configuration/FormulaEditor";
import AlgorithmVisualization from "./visualization";
import AlgorithmControl from "./visualization/algorithm_control";

function App() {
	const { algorithm, formula, isRunning } = useRunConfig();

	return (
		<div className="App d-flex flex-column vh-100 text-center">
			<Navbar bg="dark" variant="dark">
				<Container>
					<Navbar.Brand href="#home">Horn Formula Visualizer</Navbar.Brand>
				</Container>
			</Navbar>

			<Container className="d-flex flex-column py-5 flex-grow-1">
				{!isRunning ? <FormulaEditor /> : <h4>{formula.toString()}</h4>}
				<hr className="my-4" />
				{!isRunning ? <AlgorithmSelector /> : <h2>{algorithm}</h2>}
				{isRunning && (
					<>
						<hr className="my-4" />
						<AlgorithmVisualization />
						<AlgorithmControl/>
					</>
				)}
			</Container>

			<footer className="footer py-3 bg-light">
				<span className="text-muted">© 2023 Horn Formula Project</span>
			</footer>
		</div>
	);
}

export default App;
