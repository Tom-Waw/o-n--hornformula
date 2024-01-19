import numpy as np
from pydantic import BaseModel

from .base_algorithm import BaseAlgorithm


class CallByNeedState(BaseModel):
    active_clause: int | None
    marked_literals: list[bool]
    queue: list[int]
    is_satisfiable: bool | None


class CallByNeedAlgorithm(BaseAlgorithm):
    name = "Call-By-Need Algorithm"

    def _initialize(self):
        """Initialize the state for the algorithm."""
        self.marked_literals = [False] * self.formula.num_literals
        self.processed_clauses = [False] * self.formula.num_clauses

        # Initialize the queue with facts
        self.queue = self.formula.facts

    @property
    def state(self) -> CallByNeedState:
        return CallByNeedState(
            active_clause=self.active_clause,
            marked_literals=self.marked_literals,
            queue=self.queue,
            is_satisfiable=self.is_satisfiable,
        )

    async def run_step(self):
        self._initialize()
        yield self.state

        # Continue processing until satisfiability is determined or no more clauses to process.
        while self.queue:
            # Process each clause in the queue.
            self.active_clause = active_clause = self.queue.pop(0)
            head = self.poslitlist[active_clause]
            body = self.formula.bodies[active_clause]

            if not self.processed_clauses[active_clause] and np.all(body <= self.marked_literals):
                self.processed_clauses[active_clause] = True
                if head >= 0:
                    self.marked_literals[head] = True
                    # Add dependent clauses to the queue
                    for i, (body, h) in enumerate(self.formula):
                        if not self.processed_clauses[i] and body[head]:
                            self.queue.append(i)

            yield self.state

        # If there are no more clauses to process, determine satisfiability
        self.is_satisfiable = all(self.processed_clauses)
        yield self.state
