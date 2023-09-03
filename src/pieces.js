class Piece {
	constructor(name, color, value, texture = null, texture_rect = null) {
		this.name = name;
		this.color = color;
		this.value_sign = 1 ? (color = "white") : -1;
		this.value = value * this.value_sign;
		this.texture = texture;
		this.set_texture();
		this.texture_rect = texture_rect;
		this.moves = [];
		this.moved = false;
	}
	set_texture(size = 80) {
		this.texture = new Image();
		this.texture.src = `./assets/images/imgs-${size}px/${this.color}_${this.name}.png`;
	}
	add_move(move) {
		this.moves.push(move);
	}
}

export class Pawn extends Piece {
	constructor(color) {
		super("pawn", color, 1.0);
		this.dir = color == "white" ? -1 : 1;
	}
}

export class Knight extends Piece {
	constructor(color) {
		super("knight", color, 3.0);
	}
}
export class Bishop extends Piece {
	constructor(color) {
		super("bishop", color, 3.1);
	}
}
export class Rook extends Piece {
	constructor(color) {
		super("rook", color, 5);
	}
}
export class Queen extends Piece {
	constructor(color) {
		super("queen", color, 9);
	}
}
export class King extends Piece {
	constructor(color) {
		super("king", color, 10000);
	}
}
