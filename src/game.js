import { Board } from "./board.js";
import { Dragger } from "./dragger.js";
export class Game {
	constructor(width, height, ROWS, COLS, SQSIZE) {
		this.width = width;
		this.height = height;
		this.ROWS = ROWS;
		this.COLS = COLS;
		this.SQSIZE = SQSIZE;
		this.color = "black";
		this.board = new Board();
		this.dragger = new Dragger(this.SQSIZE);
	}
	draw_background(context) {
		for (let row = 0; row < this.ROWS; row++) {
			for (let col = 0; col < this.COLS; col++) {
				if ((row + col) % 2 == 0) this.color = "rgb(194,162,113)";
				else this.color = "rgb(129,84,47)";
				context.fillStyle = this.color;
				context.fillRect(
					col * this.SQSIZE,
					row * this.SQSIZE,
					this.SQSIZE,
					this.SQSIZE
				);
			}
		}
	}

	draw_pieces(context) {
		for (let row = 0; row < this.ROWS; row++) {
			for (let col = 0; col < this.COLS; col++) {
				if (this.board.squares[row][col].has_piece()) {
					let piece = this.board.squares[row][col].piece;

					//all pieces expect dragging
					if (piece != this.dragger.piece) {
						let img = piece.texture;
						context.drawImage(
							img,
							col * this.SQSIZE,
							row * this.SQSIZE,
							this.SQSIZE,
							this.SQSIZE
						);
					}
				}
			}
		}
	}
	draw_moves(context) {
		if (this.dragger.dragging) {
			this.dragger.piece.moves.forEach((move) => {
				//color
				let color =
					(move.final.row + move.final.col) % 2 == 0 ? "#C86464" : "#C84646";
				//rect
				//draw
				context.fillStyle = color;
				context.fillRect(
					move.final.col * this.SQSIZE,
					move.final.row * this.SQSIZE,
					this.SQSIZE,
					this.SQSIZE
				);
			});
		}
	}
}

//2.07
