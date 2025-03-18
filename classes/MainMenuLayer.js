import Layer from "./Layer.js"
import Button from "./Button.js"
import GameplayLayer from "./GameplayLayer.js"
import { ctx } from "../script.js"

export default class MainMenuLayer extends Layer {
	initButtons() {
		const playButtonSize = 200
		const windowSize = this.game.windowSize

		const playButton = new Button(this.game).create(
			(windowSize.w - playButtonSize) / 2,
			(windowSize.h - playButtonSize) / 2,
			playButtonSize,
			playButtonSize)
			.setColor("white")
			.setFunction(() => {
				this.onPlay()
			})

		this.buttons.push(playButton)
	}

	onPlay() {
		this.game.layers = [new GameplayLayer(this.game)]
	}

	draw() {
		const windowSize = this.game.windowSize
		const bg = windowSize.setColor("#770077").draw()

		ctx.font = "50px Comic Sans MS"
		ctx.textAlign = "center"
		ctx.textBaseline = "middle"
		ctx.fillStyle = "white"
		ctx.fillText("Cool Platformer", windowSize.w / 2, windowSize.h / 2 - 150)
		this.drawButtons()
		ctx.fillStyle = "black"
		ctx.fillText("Play", windowSize.w / 2, windowSize.h / 2)
	}
}