import numpy as np

from .base_algorithm import BaseAlgorithm, BaseAlgorithmState


class MarkingState(BaseAlgorithmState):
    marked_literals: list[bool]
    solved_clauses: list[bool]


class MarkingAlgorithm(BaseAlgorithm):
    name = "Marking Algorithm"

    def _initialize(self):
        # Initialize marked literals and solved clauses
        self.marked_literals = np.zeros(self.formula.matrix.shape[1], dtype=bool)
        self.solved_clauses = np.zeros(self.formula.matrix.shape[0], dtype=bool)

    @property
    def state(self) -> MarkingState:
        return MarkingState(
            marked_literals=self.marked_literals.tolist(),
            solved_clauses=self.solved_clauses.tolist(),
            is_satisfiable=self.is_satisfiable,
        )

    async def run_step(self):
        self._initialize()
        yield self.state

        while self.is_satisfiable is None:
            changed = False

            for i, body in enumerate(self.formula.bodies):
                if self.solved_clauses[i]:
                    continue

                head = self.formula.heads[i]
                if head >= 0 and np.all(body <= self.marked_literals):
                    self.marked_literals[head] = True
                    self.solved_clauses[i] = True
                    changed = True
                    break

            if not changed:
                # Check if all unsolved clauses have at least one unmarked literal
                satisfiable = np.all(np.any(self.formula.matrix[~self.solved_clauses] & ~self.marked_literals, axis=1))
                self.is_satisfiable = bool(satisfiable)

            yield self.state
