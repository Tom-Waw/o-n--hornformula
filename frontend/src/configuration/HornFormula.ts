export default class HornFormula {
	matrix: boolean[][];
	heads: number[];

	constructor(matrix: boolean[][] = [], heads: number[] = []) {
		this.matrix = matrix;
		this.heads = heads;
	}

	setFormula(formula: HornFormula): void {
		this.matrix = formula.matrix;
		this.heads = formula.heads;
	}

	copy(): HornFormula {
		return new HornFormula(
			[...this.matrix.map((row) => [...row])],
			[...this.heads]
		);
	}

	get literalCount(): number {
		return this.matrix[0]?.length ?? 0;
	}

	addLiteral(): void {
		this.matrix.forEach((row) => row.push(false));
	}

	deleteLiteral(index: number): void {
		this.matrix.forEach((row) => row.splice(index, 1));
		this.updateHeads(index);
	}

	updateHeads(removedIndex: number): void {
		this.heads = this.heads.map((head) => {
			if (head === removedIndex) return -1;
			if (head > removedIndex) return head - 1;
			return head;
		});
	}

	toggleLiteralUsage(clauseIndex: number, literalIndex: number): void {
		if (literalIndex < 0 || literalIndex >= this.literalCount) {
			this.addLiteral();
			literalIndex = this.literalCount - 1;
		}

		this.matrix[clauseIndex][literalIndex] =
			!this.matrix[clauseIndex][literalIndex];

		if (this.heads[clauseIndex] === literalIndex) this.heads[clauseIndex] = -1;
	}

	toogleHead(clauseIndex: number, literalIndex: number): void {
		if (literalIndex < 0 || literalIndex >= this.literalCount) {
			throw new Error("Invalid literal index for head.");
		}

		this.heads[clauseIndex] =
			this.heads[clauseIndex] !== literalIndex ? literalIndex : -1;
	}

	addClause(): void {
		this.matrix.push(new Array(this.literalCount).fill(false));
		this.heads.push(-1);
	}

	deleteClause(index: number): void {
		this.matrix.splice(index, 1);
		this.heads.splice(index, 1);
	}

	removeEmptyClauses(): void {
		for (let i = this.matrix.length - 1; i >= 0; i--) {
			if (!this.matrix[i].includes(true)) {
				this.deleteClause(i);
			}
		}
	}

	removeDuplicateClauses(): void {
		const uniqueIds = new Set<string>();

		const isUniqueMask = this.matrix.map((clause, i) => {
			const id = clause.join("") + this.heads[i];
			if (uniqueIds.has(id)) return false;

			uniqueIds.add(id);
			return true;
		});

		for (let i = this.matrix.length - 1; i >= 0; i--) {
			if (!isUniqueMask[i]) {
				this.deleteClause(i);
			}
		}
	}

	removeUnusedLiterals(): void {
		for (let i = this.literalCount - 1; i >= 0; i--) {
			if (!this.matrix.some((clause) => clause[i])) {
				this.deleteLiteral(i);
			}
		}
	}

	randomize(literalCount: number): void {
		this.matrix = [];
		this.heads = [];
		const uniqueIds = new Set<string>();

		const generateRandomClause = (): [boolean[], number] => {
			// Generate empty clause
			const clause = new Array(literalCount).fill(false);
			// Generate random literals
			const availablePositions = [...Array(literalCount).keys()];
			while (availablePositions.length) {
				// Choose a random literal
				const index = Math.floor(Math.random() * availablePositions.length);
				const lit = availablePositions.splice(index, 1)[0];
				// Assign literal in clause
				clause[lit] = true;

				if (Math.random() < 0.5) break; // Stop generating literals
			}

			// Get indices of all true literals
			const usedIndices = [...Array(literalCount).keys()].filter(
				(i) => clause[i]
			);

			// Choose a random head index from used indices or -1
			const head =
				usedIndices.length > 0 && Math.random() < 0.66
					? usedIndices[Math.floor(Math.random() * usedIndices.length)]
					: -1;

			return [clause, head];
		};

		const height = Math.floor(Math.random() * (literalCount + 1)) + 1;
		while (this.matrix.length < height) {
			const [clause, head] = generateRandomClause();
			if (!clause.includes(true)) continue;

			const id = clause.join("") + head;
			if (uniqueIds.has(id)) continue;

			uniqueIds.add(id);
			this.matrix.push(clause);
			this.heads.push(head);
		}

		this.removeUnusedLiterals();
	}

	toString(): string {
		return this.matrix
			.map((clause, i) => {
				const literals = clause
					.map((literal, j) =>
						literal ? `${this.heads[i] === j ? "" : "¬"}P${j}` : ""
					)
					.filter(Boolean)
					.join(" v ");

				return `(${literals})`;
			})
			.join(" ∧ ");
	}

	serialize(): { matrix: boolean[][]; heads: number[] } {
		return {
			matrix: this.matrix,
			heads: this.heads,
		};
	}
}

export const simpleHornFormula = new HornFormula(
	[
		[true, false, false, false, false],
		[false, true, false, false, false],
		[true, true, true, false, false],
		[false, false, true, true, false],
		[false, true, false, false, true],
		[false, false, false, true, true],
	],
	[0, 1, 2, 3, 4, -1]
);
