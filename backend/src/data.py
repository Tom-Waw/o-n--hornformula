from typing import Iterator

import numpy as np
import pydantic_numpy.typing as pnd
from pydantic import BaseModel


class Formula(BaseModel):
    matrix: pnd.Np2DArrayBool
    heads: pnd.Np1DArrayInt8

    class Config:
        frozen = True

    def __iter__(self) -> Iterator[tuple[np.ndarray, int]]:
        for clause, head in zip(self.matrix, self.heads):
            yield (clause, int(head))

    @property
    def num_clauses(self):
        """Returns the number of clauses in the formula."""
        return self.matrix.shape[0]

    @property
    def num_literals(self):
        """Returns the number of literals in the formula."""
        return self.matrix.shape[1]

    @property
    def bodies(self):
        """Returns the clauses of the formula, without the head literals."""
        head_mask = np.ones(self.matrix.shape, dtype=bool)

        valid_heads = self.heads >= 0
        head_mask[valid_heads, self.heads[valid_heads]] = False

        return self.matrix & head_mask

    @property
    def facts(self):
        """Returns a list of facts from the formula. A fact is a clause with no body (no negative literals)."""
        return [i for i, (clause, head) in enumerate(self) if head >= 0 and np.sum(clause) == 1]


class AlgorithmConfig(BaseModel):
    formula: Formula
    algorithm: str
    walkthrough: bool = False
