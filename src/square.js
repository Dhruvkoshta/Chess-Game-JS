export class Square {
	constructor(row, col, piece = null) {
		this.row = row;
		this.col = col;
		this.piece = piece;
	}
	has_piece() {
		return this.piece != null;
	}
	isempty() {
		return !this.has_piece();
	}
	has_team_piece(color) {
		return this.has_piece() && this.piece.color == color;
	}
	has_enemy_piece(color) {
		return this.has_piece() && this.piece.color != color;
	}
	isempty_or_enemy(color) {
		return this.isempty() || this.has_enemy_piece(color);
	}

	static in_range(args) {
		for (let arg = 0; arg < args.length; arg++) {
			const element = args[arg];
			if (element < 0 || element > 7) {
				return false;
			}
		}
		return true;
		// args.forEach((arg) => {
		// 	if (arg < 0 || arg > 7) return false;
		// 	else return true;
		// });
	}
}
