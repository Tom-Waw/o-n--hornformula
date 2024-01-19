from algorithms import BaseAlgorithm
from data import AlgorithmConfig
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
active_algorithm = None

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


@app.get("/algorithms")
async def get_algorithms():
    return [cls.name for cls in BaseAlgorithm.__subclasses__()]


@app.post("/setup")
async def setup(config: AlgorithmConfig):
    global active_algorithm
    algorithm_class = next(cls for cls in BaseAlgorithm.__subclasses__() if cls.name == config.algorithm)
    active_algorithm = algorithm_class(config.formula)


@app.get("/step")
async def step():
    global active_algorithm
    if active_algorithm is None:
        raise Exception("Algorithm not set up")

    try:
        return await anext(active_algorithm.generator)
    except StopAsyncIteration:
        return 
