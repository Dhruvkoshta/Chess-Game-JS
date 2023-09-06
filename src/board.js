import { Square } from "./square.js";
import { Pawn, Knight, Bishop, Queen, King, Rook } from "./pieces.js";
import { Move } from "./move.js";

export class Board {
	constructor() {
		this.squares = [];
		this.ROWS = 8;
		this.COLS = 8;
		for (let col = 0; col < this.COLS; col++) {
			this.squares.push([0, 0, 0, 0, 0, 0, 0, 0]);
		}
		this.row_pawn;
		this.row_other;
		this.last_move = null;
		this.#create();
		this.#add_pieces("white");
		this.#add_pieces("black");
	}

	move(piece, move, inital, final) {
		// const inital = move.inital;
		// const final = move.final;

		//console board move update
		this.squares[inital.row][inital.col].piece = null;
		this.squares[final.row][final.col].piece = piece;

		piece.moved = true;

		//clear valid moves
		piece.clear_moves();

		//set last move
		this.last_move = move;
	}

	valid_move(piece, move) {
		let isTrue;
		piece.moves.forEach((allmove) => {
			if (JSON.stringify(allmove) === JSON.stringify(move)) isTrue = true;
			// console.log(move.initial == allmove.initial);
		});
		return isTrue;
		// return move in piece.moves;
	}

	#create() {
		for (let row = 0; row < this.ROWS; row++) {
			for (let col = 0; col < this.COLS; col++) {
				this.squares[row][col] = new Square(row, col);
			}
		}
	}

	calc_moves(piece, row, col) {
		//FUNCTIONS FOR MOVEMENT
		const pawn_moves = () => {
			let steps = piece.moved ? 1 : 2;
			// vertical moves
			let start = row + piece.dir;
			let end = row + piece.dir * (1 + steps);

			// piece.dir the <> sign was getting problem so i put it in if else statement

			if (piece.dir == -1) {
				for (let move_row = start; move_row > end; move_row += piece.dir) {
					if (Square.in_range([move_row])) {
						if (this.squares[move_row][col].isempty()) {
							//create inital and final move square
							let initial = new Square(row, col);
							let final = new Square(move_row, col);
							let move = new Move(initial, final);

							piece.add_move(move);
						} else break;
					} else break;
				}
			} else {
				for (let move_row = start; move_row < end; move_row += piece.dir) {
					if (Square.in_range([move_row])) {
						if (this.squares[move_row][col].isempty()) {
							//create inital and final move square
							let initial = new Square(row, col);
							let final = new Square(move_row, col);
							let move = new Move(initial, final);

							piece.add_move(move);
						} else break;
					} else break;
				}
			}

			//diagonal moves
			let possible_move_row = row + piece.dir;
			let possible_move_cols = [col - 1, col + 1];
			// if (col == 0) possible_move_cols = [col + 1];
			// if (col == 7) possible_move_cols = [col - 1];

			possible_move_cols.forEach((possible_move_col) => {
				if (Square.in_range([possible_move_row, possible_move_col])) {
					if (
						this.squares[possible_move_row][possible_move_col].has_enemy_piece(
							piece.color
						)
					) {
						//create inital and final move square
						let initial = new Square(row, col);
						let final = new Square(possible_move_row, possible_move_col);
						let move = new Move(initial, final);
						//append move
						piece.add_move(move);
					}
				}
			});
		};

		const knight_moves = () => {
			let possible_moves = [
				//8 possible moves
				[row - 2, col - 1],
				[row - 2, col + 1],
				[row + 2, col - 1],
				[row + 2, col + 1],
				[row - 1, col - 2],
				[row - 1, col + 2],
				[row + 1, col - 2],
				[row + 1, col + 2],
			];
			possible_moves.forEach((possible_move) => {
				let possible_move_row = possible_move[0];
				let possible_move_col = possible_move[1];
				if (Square.in_range([possible_move_row, possible_move_col])) {
					if (
						this.squares[possible_move_row][possible_move_col].isempty_or_enemy(
							piece.color
						)
					) {
						//create new move
						let initial = new Square(row, col);
						let final = new Square(possible_move_row, possible_move_col);
						// move
						const move = new Move(initial, final);

						piece.add_move(move);
					}
				}
			});
		};

		const straightLine_moves = (incrs) => {
			incrs.forEach((inc) => {
				let row_inc = inc[0];
				let col_inc = inc[1];
				let possible_move_row = row + row_inc;
				let possible_move_col = col + col_inc;

				while (true) {
					//boundaries
					if (possible_move_row > 7) break;
					if (possible_move_row < 0) break;
					if (possible_move_col < 0) break;
					if (possible_move_col > 7) break;

					if (Square.in_range(possible_move_row, possible_move_col)) {
						let initial = new Square(row, col);
						let final = new Square(possible_move_row, possible_move_col);
						const move = new Move(initial, final);
						//is empty = continue
						if (this.squares[possible_move_row][possible_move_col].isempty()) {
							//append a new move
							piece.add_move(move);
						}
						//has enemy piece = break
						if (
							this.squares[possible_move_row][
								possible_move_col
							].has_enemy_piece(piece.color)
						) {
							//append a new move
							piece.add_move(move);
							break;
						}
						//has team piece
						if (
							this.squares[possible_move_row][possible_move_col].has_team_piece(
								piece.color
							)
						) {
							break;
						}
					} else break;
					//increments
					possible_move_row += row_inc;
					possible_move_col += col_inc;
				}
			});
		};

		const king_moves = () => {
			const possible_moves = [
				[row - 1, col + 0], //up
				[row - 1, col + 1], //up right
				[row + 0, col + 1], //right
				[row + 1, col + 1], //down right
				[row + 1, col + 0], //down
				[row + 1, col - 1], //down left
				[row + 0, col - 1], //left
				[row - 1, col - 1], //up left
			];
			possible_moves.forEach((possible_move) => {
				let possible_move_row = possible_move[0];
				let possible_move_col = possible_move[1];
				if (Square.in_range([possible_move_row, possible_move_col])) {
					if (
						this.squares[possible_move_row][possible_move_col].isempty_or_enemy(
							piece.color
						)
					) {
						//create new move
						let initial = new Square(row, col);
						let final = new Square(possible_move_row, possible_move_col);
						// move
						const move = new Move(initial, final);

						piece.add_move(move);
					}
				}
			});
			//CASTLING MOVES
		};

		if (piece instanceof Pawn) {
			pawn_moves();
		} else if (piece instanceof Knight) {
			knight_moves();
		} else if (piece instanceof Bishop) {
			straightLine_moves([
				[-1, +1], //up right
				[-1, -1], // up left
				[1, 1], // down right
				[1, -1], // down left
			]);
		} else if (piece instanceof Rook) {
			straightLine_moves([
				[-1, 0], //up
				[1, 0], //down
				[0, 1], //right
				[0, -1], //left
			]);
		} else if (piece instanceof Queen) {
			straightLine_moves([
				[-1, 0], //up
				[1, 0], //down
				[0, 1], //right
				[0, -1], //left
				[-1, +1], //up right
				[-1, -1], // up left
				[1, 1], // down right
				[1, -1], // down left
			]);
		} else if (piece instanceof King) {
			king_moves();
		}
	}

	#add_pieces(color) {
		if (color == "white") {
			this.row_pawn = 6;
			this.row_other = 7;
		} else {
			this.row_pawn = 1;
			this.row_other = 0;
		}
		// PAWNS
		for (let col = 0; col < this.COLS; col++) {
			this.squares[this.row_pawn][col] = new Square(
				this.row_pawn,
				col,
				new Pawn(color)
			);
		}
		// KNIGHTS
		this.squares[this.row_other][1] = new Square(
			this.row_other,
			1,
			new Knight(color)
		);
		this.squares[this.row_other][6] = new Square(
			this.row_other,
			6,
			new Knight(color)
		);
		// BISHOP
		this.squares[this.row_other][2] = new Square(
			this.row_other,
			2,
			new Bishop(color)
		);
		this.squares[this.row_other][5] = new Square(
			this.row_other,
			5,
			new Bishop(color)
		);
		// ROOK
		this.squares[this.row_other][0] = new Square(
			this.row_other,
			0,
			new Rook(color)
		);
		this.squares[this.row_other][7] = new Square(
			this.row_other,
			7,
			new Rook(color)
		);
		//QUEEN
		this.squares[this.row_other][3] = new Square(
			this.row_other,
			3,
			new Queen(color)
		);
		//KING

		this.squares[this.row_other][4] = new Square(
			this.row_other,
			4,
			new King(color)
		);
	}
}
