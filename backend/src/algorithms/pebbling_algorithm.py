import numpy as np
from pydantic import BaseModel

from .base_algorithm import BaseAlgorithm


class PebblingState(BaseModel):
    active_clause: int | None
    dependant_clause: int | None
    marked_literals: list[bool]
    queue: list[int]
    numargs: list[int]
    clauselist: dict[int, list[int]]
    is_satisfiable: bool | None


class PebblingAlgorithm(BaseAlgorithm):
    name = "Pebbling Algorithm"

    def _initialize(self):
        """Initialize additional structures for linear-time processing"""
        self.marked_literals: list[bool] = [False] * self.formula.num_literals
        # Number of negative literals in each clause
        self.numargs: list[int] = np.sum(self.formula.bodies, axis=1, dtype=int).tolist()
        # List of positive literals in the order they appear in the matrix
        self.poslitlist: list[int] = self.formula.heads.tolist()
        # Maps positive literals to the clauses they appear in as negative literals
        self.clauselist = {
            head: [i for i, body in enumerate(self.formula.bodies) if body[head]]
            for head in self.poslitlist
            if head >= 0
        }
        # Queue of clauses ready to be processed
        # Initially, populate the queue with clauses that are just a single positive literal
        self.queue = self.formula.facts

        # Run tracking variables
        self.active_clause: int | None = None
        self.dependant_clause: int | None = None

    @property
    def state(self) -> PebblingState:
        return PebblingState(
            active_clause=self.active_clause,
            dependant_clause=self.dependant_clause,
            marked_literals=self.marked_literals,
            queue=self.queue,
            numargs=self.numargs,
            clauselist=self.clauselist,
            is_satisfiable=self.is_satisfiable,
        )

    async def run_step(self):
        self._initialize()
        yield self.state

        consistent = True
        while self.queue and consistent:
            self.active_clause = self.queue.pop(0)
            head = self.poslitlist[self.active_clause]

            if not self.marked_literals[head]:
                self.marked_literals[head] = True

                for dependent_clause in self.clauselist.get(head, []):
                    self.dependant_clause = dependent_clause
                    self.numargs[dependent_clause] -= 1

                    if self.numargs[dependent_clause] == 0:
                        next_head = self.poslitlist[dependent_clause]

                        if next_head == -1:
                            consistent = False
                            break

                        if not self.marked_literals[next_head]:
                            self.queue.append(dependent_clause)

                    yield self.state

                self.dependant_clause = None

            yield self.state

        self.is_satisfiable = consistent
        yield self.state
