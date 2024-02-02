from pydantic import BaseModel

from .base_algorithm import BaseAlgorithm
from .pebbling_algorithm import PebblingAlgorithm


class Edge(BaseModel):
    label: int  # Label describing the relationship or action
    head: str  # Identifier for the head node this edge points to


class Node(BaseModel):
    val: bool = False  # Evaluation outcome of the node
    computed: bool = False  # Tracks if the node has been computed
    susp: bool = False  # Tracks if the node is being evaluated (is suspended)
    loop: bool = False  # Tracks if the node is part of a loop
    edges: list[Edge] = []  # List of edges originating from this node


class CallByNeedState(BaseModel):
    nodes: dict[str, Node]  # Dictionary of nodes, with node labels as keys
    is_satisfiable: bool | None = None


class CallByNeedAlgorithm(BaseAlgorithm):
    name = "Call-By-Need Algorithm"

    def _initialize(self):
        """Initialize the state for the algorithm."""

        # Initialize Nodes
        self.nodes = {str(i): Node() for i in range(self.formula.num_literals)}
        self.nodes["false"] = Node()
        self.nodes["true"] = Node(val=True, computed=True)

        # Initialize Facts
        for idx in self.formula.facts:
            head = str(self.formula.heads[idx])
            self.nodes[head].val = True
            self.nodes[head].computed = True
            self.nodes[head].edges = [Edge(label=idx, head="true")]  # add edge to true node

        # Initialize Edges
        for idx, clause in enumerate(self.formula.matrix):
            head = self.formula.heads[idx]
            source = str(head) if head >= 0 else "false"

            for i, literal in enumerate(clause):
                if not literal or i == head:
                    continue

                self.nodes[source].edges.append(Edge(label=idx, head=str(i)))

    @property
    def state(self) -> CallByNeedState:
        return CallByNeedState(nodes=self.nodes)

    def bottom_up_visit(self, p):
        node = self.nodes[p]
        subgraph = {node}

        def rec_subgraph(node):
            for edge in node.edges:
                if edge.head not in subgraph:
                    subgraph.add(edge.head)
                    rec_subgraph(self.nodes[edge.head])

        rec_subgraph(node)

        sub_formula = subgraph

        pebbling = PebblingAlgorithm(self.formula)
        gen = pebbling.run_step()

        # return result of pebbling algorithm (state.is_satisfiable)
        # last step of generator is the result
        while True:
            try:
                next(gen)
            except StopIteration as e:
                break
        
        self.is_satisfiable = pebbling.is_satisfiable
        self.nodes[start_node].val = not pebbling.is_satisfiable
        self.nodes[start_node].computed = True
        

    def evalue(self, p):
        node = self.nodes[p]
        node.susp = True
        tagset = {edge.label for edge in node.edges}

        if not node.val:
            for i in tagset:
                arc = [edge for edge in node.edges if edge.label == i]
                node_set = [edge.head for edge in arc]

                temp = self.minnode(node_set)
                if temp:
                    node.val = True
                    if node.loop:
                        self.bottom_up_visit(p)

        node.susp = False
        node.loop = False
        node.computed = True
        yield self.state

        return node.val

    def minnode(self, nodes):
        number = 0
        for j in nodes:
            node = self.nodes[j]
            if node.computed:
                if not node.val:
                    number += 1
            elif not node.susp:
                temp = self.evalue(j)
                if not temp:
                    number += 1
            else:
                node.loop = True
                number += 1

        return number == 0

    async def run_step(self):
        self._initialize()
        yield self.state

        temp = self.evalue("false")
        self.is_satisfiable = not temp

        yield self.state
