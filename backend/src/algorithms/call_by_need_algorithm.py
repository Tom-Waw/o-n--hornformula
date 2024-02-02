import numpy as np
from pydantic import BaseModel

from .base_algorithm import BaseAlgorithm


class Edge(BaseModel):
    label: int  # Label describing the relationship or action
    head: str  # Identifier for the head node this edge points to

class Node(BaseModel):
    val: bool  = False # Evaluation outcome of the node
    computed: bool  = False # Tracks if the node has been computed
    susp: bool  = False # Tracks if the node is being evaluated (is suspended)
    loop: bool  = False # Tracks if the node is part of a loop
    edges: list[Edge] = [] # List of edges originating from this node

class CallByNeedState(BaseModel):
    nodes: dict[str, Node]  # Dictionary of nodes, with node labels as keys
    is_satisfiable: bool | None = None

class CallByNeedAlgorithm(BaseAlgorithm):
    name = "Call-By-Need Algorithm"

    def _initialize(self):
        """Initialize the state for the algorithm."""

        #initialize facts
        self.nodes = {str(i): Node() for i in range(self.formula.num_literals)}
        self.nodes['false'] = Node()
        self.nodes['true'] = Node(val=True, computed=True)
        for fact_clause_index in self.formula.facts:
            fact = str(self.formula.heads[fact_clause_index])
            #self.nodes[fact] = Node()
            self.nodes[fact].val = True
            self.nodes[fact].computed = True
            self.nodes[fact].edges = [Edge(label=fact_clause_index, head='true')] #add edge to true node
        
        for clause_index, head in enumerate(self.formula.heads):
            tail = str(head) if head >=0 else 'false'

            if tail not in self.nodes:
                self.nodes[tail] = Node()

            for i, literal in enumerate(self.formula.matrix[clause_index]):
                if literal:
                    self.nodes[tail].edges.append(Edge(label=clause_index, head=str(i)))
                


    @property
    def state(self) -> CallByNeedState:
        return CallByNeedState(
            nodes = self.nodes
        )

    def bottom_up_visit(self, start_node):
        # Placeholder for visited nodes to avoid re-evaluation
        visited = set()

        def visit(node_id):
            if node_id in visited:
                return
            visited.add(node_id)

            node = self.nodes[node_id]
            for edge in node.edges:
                if edge.head not in visited:
                    visit(edge.head)

            # After visiting all dependencies, evaluate the node if not already computed
            if not node.computed:
                self.evalue(node_id)
    def evalue(self, p):
        node = self.nodes[p]
        node.susp = True
        tagset = {edge.label for edge in node.edges}

        for i in tagset:
            if not node.val:
                arc = [edge for edge in node.edges if edge.label == i]
                node_set = {edge.head for edge in arc}
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
            else:
                if not node.susp:
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

        temp = self.evalue('false')
        self.is_satisfiable = not temp

        yield self.state
