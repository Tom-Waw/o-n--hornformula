declare module "react-graph-vis" {
	// Import the original types from the react-graph-vis package
	import { Data, Edge, Network, Node, Options } from "vis-network/standalone";

	// Re-export the original Data, Network, Options, Edge, and Node types from vis-network
	export { Edge, Node, Options };

	// Extend the GraphProps interface to fix or add any missing types
	export interface GraphProps {
		graph: Data;
		options?: Options;
		events?: {
			[eventName: string]: (params?: unknown) => void;
		};
		style?: React.CSSProperties;
		getNetwork?: (network: Network) => void;
		// ... add any other missing or incorrect props
	}

	// Define and export the Graph component with the extended props
	const Graph: React.FC<GraphProps>;
	export default Graph;
}
