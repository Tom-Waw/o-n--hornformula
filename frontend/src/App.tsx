import useRunConfig from "@/run_config/useRunConfig";
import { Container, Navbar } from "react-bootstrap";
import AlgorithmConfiguration from "./configuration";
import AlgorithmVisualization from "./visualization";

function App() {
	const { isRunning } = useRunConfig();

	return (
		<div className="App d-flex flex-column vh-100 text-center">
			<Navbar bg="dark" variant="dark">
				<Container>
					<Navbar.Brand href="#home">Horn Formula Visualizer</Navbar.Brand>
				</Container>
			</Navbar>

			<Container className="d-flex flex-column py-5 flex-grow-1">
				<AlgorithmConfiguration />
				{isRunning && (
					<>
						<hr className="my-5" />
						<AlgorithmVisualization />
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
