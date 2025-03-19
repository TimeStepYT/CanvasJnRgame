import Rect from "./Rect.js"
import Point from "./Point.js"
import Layer from "./Layer.js"
import Button from "./Button.js"
import GameplayLayer from "./GameplayLayer.js"
import Size from "./Size.js"
import Text from "./Text.js"

export default class MainMenuLayer extends Layer {
	initButtons() {
		const playButtonSize = new Size(200, 200)
		const windowSize = this.game.windowSize

		const playButton = new Button(this.game).create(
			(windowSize.w - playButtonSize.w) / 2,
			(windowSize.h - playButtonSize.h) / 2,
			playButtonSize.w, playButtonSize.h)
			.setFunction(() => {
				this.onPlay()
			})


		const playText = new Text()
			.create("Play", new Point(playButton.w / 2, playButton.h / 2), 50)
			.setAlignX("center")
			.setAlignY("middle")
		const playTextShadow = new Text()
			.create("Play", new Point(playButton.w / 2 + 1, playButton.h / 2 + 1), 50)
			.setAlignX("center")
			.setAlignY("middle")
			.setColor("white")

		playButton.content.push(new Rect().create(0, 0, playButton.w, playButton.h / 4).setColor("#ff00ff"))
		playButton.content.push(new Rect().create(0, 0 + playButton.h / 4 * 3, playButton.w, playButton.h / 4).setColor("#ff00ff"))

		playButton.content.push(playTextShadow)
		playButton.content.push(playText)
		this.buttons.push(playButton)
	}

	onPlay() {
		this.game.layers = [new GameplayLayer(this.game)]
	}

	draw() {
		const windowSize = this.game.windowSize

		new Rect().create(0, 0, windowSize.w, windowSize.h).setColor("#770077").draw()

		const title = new Text()
			.create("Cool Platformer", new Point(windowSize.w / 2, windowSize.h / 2 - 150), 50)
			.setAlignX("center")
			.setAlignY("middle")
			.setColor("white")

		title.draw()
	}
}