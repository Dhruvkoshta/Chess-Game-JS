export class Dragger {
	constructor(SQSIZE) {
		this.SQSIZE = SQSIZE;
		this.ROWS = 8;
		this.COLS = 8;
		this.mouseX = 0;
		this.mouseY = 0;
		this.initial_row = 0;
		this.initial_col = 0;
		this.piece = null;
		this.dragging = false;
	}
	update_draw(context) {
		//texture
		this.piece.set_texture(128);

		//image
		let img = this.piece.texture;
		//rect

		context.drawImage(
			img,
			this.mouseX - 128 / 2,
			this.mouseY - 128 / 2,
			128,
			128
		);
	}

	update_mouse(mouseX, mouseY) {
		this.mouseX = mouseX;
		this.mouseY = mouseY;
	}
	save_initial(mouseX, mouseY) {
		this.initial_row = Math.floor(mouseY / this.SQSIZE);
		this.initial_col = Math.floor(mouseX / this.SQSIZE);
	}
	drag_piece(piece) {
		this.piece = piece;
		this.dragging = true;
	}
	undrag_piece() {
		this.piece = null;
		this.dragging = false;
	}
}
