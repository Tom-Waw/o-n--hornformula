import { BaseAlgorithmState } from "@/api/algorithmContext";
import useAlgorithm from "@/api/useAlgorithm";
import HornFormula from "@/configuration/HornFormula";
import useRunConfig from "@/run_config/useRunConfig";
import React, { useMemo } from "react";
import Graph, { Edge, Node, Options } from "react-graph-vis";

interface PebblingRunState extends BaseAlgorithmState {
	active_clause: number | null;
	dependant_clause: number | null;
	marked_literals: boolean[];
	numargs: number[];
	clauselist: { [key: number]: number[] };
}

const PebblingVisualization: React.FC = () => {
	const { formula } = useRunConfig();
	const { data } = useAlgorithm<PebblingRunState>();

	// Generate graph data from the current algorithm state and formula
	const graph = useMemo(() => {
		return convertToGraph(formula, data!);
	}, [formula, data]);

	const options: Options = {
		autoResize: true,
		height: "400px",
		clickToUse: true,
		layout: {
			hierarchical: {
				enabled: true,
				direction: "LR",
				sortMethod: "directed",
			},
		},
		edges: {
			color: "#000000",
			width: 2,
			smooth: true,
		},
		physics: {
			enabled: true,
		},
	};

	return (
		<div className="flex-grow-1">
			<Graph graph={graph} options={options} />
		</div>
	);
};

// Convert the current state of the Pebbling Algorithm and formula to a graph format
const convertToGraph = (
	formula: HornFormula,
	{
		marked_literals,
		active_clause,
		numargs,
		dependant_clause,
	}: PebblingRunState
): { nodes: Node[]; edges: Edge[] } => {
	const active_node =
		active_clause !== null ? formula.heads[active_clause] : null;

	// Create a node for each literal in the formula
	const nodes: Node[] = [];
	// Add a node to the array, highlighting the active node
	const addNode = (id: number, color: string, label: string | null = null) => {
		nodes.push({
			id,
			label: label || `P${id}`,
			color: id === active_node ? "blue" : color,
			font: { color: "white" },
		});
	};

	// Create nodes for each literal in the formula
	marked_literals.forEach((marked, index) => {
		addNode(index, marked ? "green" : "grey");
	});
	// Add special nodes for 'True' and 'False'
	addNode(-1, "black", "F");
	addNode(-2, "black", "T");

	// Create a map to consolidate edges by source and target
	const edgeMap = new Map<string, Edge>();
	// Add an edge to the map, combining edges with the same source and target
	const addEdge = (source: number, target: number, clause: number) => {
		const key = `${source}-${target}`;
		let edge = edgeMap.get(key);

		// Create a new edge if one does not exist
		if (!edge) {
			edge = {
				id: key,
				from: source,
				to: target,
				label: `${clause}`,
				color: "black",
			};
		} else {
			edge.label += `, ${clause}`;
		}

		// Highlight edges that are active or dependent
		if (clause === dependant_clause) {
			edge.color = "blue";
		} else if (numargs[clause] === 0 && edge.color === "black") {
			edge.color = "green";
		}

		edgeMap.set(key, edge);
	};

	// Add edges from each literal to its head
	formula.matrix.forEach((clause, index) => {
		const head = formula.heads[index];
		clause.forEach((used, lit) => {
			if (used && lit !== head) {
				addEdge(lit, head, index);
			}
		});

		// Add edges from the True node to all clauses that are facts (no negative literals)
		if (clause.every((used, lit) => !used || lit === head)) {
			addEdge(-2, head, index);
		}
	});

	// Convert edgeMap values to an array
	const edges: Edge[] = Array.from(edgeMap.values());

	return {
		nodes,
		edges,
	};
};

export default PebblingVisualization;
