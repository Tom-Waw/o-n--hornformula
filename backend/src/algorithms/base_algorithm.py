from abc import ABC, abstractmethod

from data import Formula
from pydantic import BaseModel, validate_call


class BaseAlgorithmState(BaseModel):
    is_satisfiable: bool | None


class BaseAlgorithm(ABC):
    @property
    @abstractmethod
    def name(self) -> str:
        ...

    @property
    @abstractmethod
    def state(self) -> BaseAlgorithmState:
        ...

    @property
    def generator(self):
        if self._generator is None:
            self._generator = self.run_step()

        return self._generator

    @validate_call
    def __init__(self, formula: Formula):
        self._generator = None

        self.formula = formula
        self.is_satisfiable: bool | None = None

    @abstractmethod
    async def _initialize(self):
        ...

    @abstractmethod
    async def run_step(self):
        ...


# class BreadthFirstPebblingAlgorithm(BaseAlgorithm):
#     name = "Breath First Pebbling Algorithm"


# class CallByNeedAlgorithm(BaseAlgorithm):
#     name = "Call-By-Need Algorithm"
