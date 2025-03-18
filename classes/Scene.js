export default class Scene {
	constructor(game) {
		this.game = game
	}

	game = null

	draw() {
		// This class is supposed to get inherited, so it shouldn't draw anything
	}
}