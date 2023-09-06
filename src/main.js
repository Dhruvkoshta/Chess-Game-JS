import { Game } from "./game.js";
import { Move } from "./move.js";
import { Square } from "./square.js";

window.addEventListener("load", () => {
	const canvas = document.getElementById("canvas1");
	const ctx = canvas.getContext("2d");
	canvas.width = 800;
	canvas.height = 800;

	class Main {
		constructor(width, height, context) {
			this.width = width;
			this.height = height;
			this.ROWS = 8;
			this.COLS = 8;
			this.SQSIZE = width / this.COLS;
			this.game = new Game(
				this.width,
				this.height,
				this.ROWS,
				this.COLS,
				this.SQSIZE
			);
			this.dragger = this.game.dragger;
			this.board = this.game.board;

			//CLICK

			window.addEventListener("mousedown", (e) => {
				// this.dragger.update_mouse(event)
				this.dragger.update_mouse(e.offsetX, e.offsetY);

				let clicked_row = Math.floor(this.dragger.mouseY / this.SQSIZE);
				let clicked_col = Math.floor(this.dragger.mouseX / this.SQSIZE);
				//IF Cliked has a piece
				if (this.board.squares[clicked_row][clicked_col].has_piece()) {
					let piece = this.board.squares[clicked_row][clicked_col].piece;

					//valid piece
					if (piece.color == this.game.next_player) {
						this.board.calc_moves(piece, clicked_row, clicked_col);

						this.dragger.save_initial(e.offsetX, e.offsetY);
						this.dragger.drag_piece(piece);
					}
					//show methods
					// this.game.draw_background(context);
					// this.game.draw_moves(context);
					// this.game.draw_pieces(context);
				}
			});
			// MOVE
			window.addEventListener("mousemove", (e) => {
				if (this.dragger.dragging) {
					this.dragger.update_mouse(e.offsetX, e.offsetY);

					this.dragger.update_draw(context);
				}
			});
			// UP
			window.addEventListener("mouseup", (e) => {
				if (this.dragger.dragging) {
					this.dragger.update_mouse(e.offsetX, e.offsetY);

					let released_row = Math.floor(this.dragger.mouseY / this.SQSIZE);
					let released_col = Math.floor(this.dragger.mouseX / this.SQSIZE);

					//create possible move
					let inital = new Square(
						this.dragger.initial_row,
						this.dragger.initial_col
					);
					let final = new Square(released_row, released_col);
					let move = new Move(inital, final);
					// console.log(this.board.valid_move(this.dragger.piece, move));
					if (this.board.valid_move(this.dragger.piece, move)) {
						this.board.move(this.dragger.piece, move, inital, final);
						//draw move
						this.game.draw_pieces(context);
						this.game.next_turn();
					}
				}

				this.dragger.undrag_piece();
			});
		}
		update() {}
		draw(context) {
			this.game.draw_background(context);
			this.game.draw_moves(context);
			this.game.draw_pieces(context);
		}
	}

	const main = new Main(canvas.width, canvas.height, ctx);

	function animate() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// main.update();
		main.draw(ctx);
		//drawing dragging piece
		if (main.dragger.dragging) main.dragger.update_draw(ctx);

		requestAnimationFrame(animate);
	}
	animate();
});
