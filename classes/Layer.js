export default class Layer {
	constructor(game) {
		this.game = game

		this.initButtons()
	}

	game = null

	buttons = []

	// Empty classes are supposed to get inherited, so they shouldn't do anything yet
	onmousemove(e) { }
	onmousedown(e) { }
	onmouseup(e) { }
	onkeyup(e) { }
	onkeydown(e) { }
	initButtons() { }

	draw() { }
}