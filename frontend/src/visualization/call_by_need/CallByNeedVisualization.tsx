import { BaseAlgorithmState } from "@/api/algorithmContext";
import useAlgorithm from "@/api/useAlgorithm";
import React, { useMemo } from "react";
import Graph, { Edge, Node, Options } from "react-graph-vis";

interface AlgorithmEdge {
  label: number; // Label describing the relationship or action
  head: string; // Identifier for the head node this edge points to
}

interface AlgorithmNode {
  val: boolean; // Evaluation outcome of the node
  computed: boolean; // Tracks if the node has been computed
  susp: boolean; // Tracks if the node is being evaluated (is suspended)
  loop: boolean; // Tracks if the node is part of a loop
  edges: AlgorithmEdge[]; // List of edges originating from this node
}

interface CallByNeedRunState extends BaseAlgorithmState {
  nodes: { [key: string]: AlgorithmNode }; // Dictionary of nodes, with node labels as keys
}


const CallByNeedVisualization: React.FC = () => {
	const { data } = useAlgorithm<CallByNeedRunState>();

	// Generate graph data from the current algorithm state and formula
	const graph = useMemo(() => {
		return convertToGraph(data!);
	}, [data]);

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
		data: CallByNeedRunState
): { nodes: Node[]; edges: Edge[] } => {
	// Create a node for each literal in the formula
	const nodes: Node[] = [];
	// Add a node to the array, highlighting the active node

	const addNode = (id: string, color: string) => {
		nodes.push({
			id,
			label: id === 'true' || id === 'false' ? id : `P${id}`,
			color: color,
			font: { color: "white" },
		});
	};

	// Create nodes for each literal in the formula
	Object.entries(data.nodes).forEach(([id, node]) => {
		if (node.val && node.computed){
			addNode(id, "green");
		}
		else if (node.susp){
			addNode(id, "blue");
		}
		else if (node.loop){
			addNode(id, "yellow");
		}
		else if (!node.val && node.computed){
			addNode(id, "red");
		}
		else {
			addNode(id, "grey");
		}

	});


	/* 
	// Add an edge to the map, combining edges with the same source and target
	const addEdge = (source: string, target: string, clause: number) => {
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
	*/

	const edges_list: Edge[] = [];

	return {
		nodes,
		edges: edges_list,
	};
};

export default CallByNeedVisualization;
