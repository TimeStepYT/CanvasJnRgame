export default class Layer {
	constructor(game) {
		this.game = game

		this.initButtons()
	}

	game = null

	buttons = []

	// Empty classes are supposed to get inherited, so they shouldn't do anything yet
	onmousemove(e) { }
	onmousedown(e) {
		for (const button of this.buttons) {
			if (button.isColliding(this.game.mouse.pos.getRect()))
				button.onClick()
		}
	}
	onmouseup(e) { }
	onkeyup(e) { }
	onkeydown(e) { }
	initButtons() { }

	draw() { }
	drawButtons() {
		for (const button of this.buttons)
			button.draw()
	}
}