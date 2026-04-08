import Rect from "./Rect.js"
import Point from "./Point.js"
import Layer from "./Layer.js"
import Button from "./Button.js"
import GameplayLayer from "./GameplayLayer.js"
import Size from "./Size.js"
import Text from "./Text.js"
import ConcaveShape from "./ConcaveShape.js"
import Triangle from "./Triangle.js"

export default class MainMenuLayer extends Layer {
	testShape = null
	testingShape = ConcaveShape.create([
		new Point(313, 144),
		new Point(279, 291),
		new Point(111, 290),
		new Point(254, 375),
		new Point(214, 472),
		new Point(355, 395),
		new Point(463, 474),
		new Point(415, 340),
		new Point(496, 277),
		new Point(342, 262)
	])

	oneTime = true

	initButtons() {
		const playButtonSize = new Size(200, 200)
		const windowSize = this.game.windowSize

		const playButton = Button.create(
			this.game,
			(windowSize.w - playButtonSize.w) / 2,
			(windowSize.h - playButtonSize.h) / 2,
			playButtonSize.w, playButtonSize.h)
			.setFunction(() => {
				this.onPlay()
			})

		const playText = Text
			.create("Play", new Point(playButton.w / 2, playButton.h / 2), 50)
			.setAlignX("center")
			.setAlignY("middle")
		const playTextShadow = Text
			.create("Play", new Point(playButton.w / 2 + 1, playButton.h / 2 + 1), 50)
			.setAlignX("center")
			.setAlignY("middle")
			.setColor("white")

		playButton.content.push(Rect.create(0, 0, playButton.w, playButton.h / 4).setColor("#ff00ff"))
		playButton.content.push(Rect.create(0, 0 + playButton.h / 4 * 3, playButton.w, playButton.h / 4).setColor("#ff00ff"))

		playButton.content.push(playTextShadow)
		playButton.content.push(playText)
		this.buttons.push(playButton)
	}

	onPlay() {
		this.willExit = true
		this.game.layers = [new GameplayLayer(this.game)]
	}

	onmousedown(e) {
		const pos = this.game.mouse.pos

		if (this.testShape === null)
			this.testShape = ConcaveShape.create([pos])
		else {
			this.testShape.addPoints([pos])
			this.testShape.updateConvexShapes()
		}
	}

	draw() {
		const windowSize = this.game.windowSize

		Rect.create(0, 0, windowSize.w, windowSize.h).setColor("#770077").draw()

		const title = Text
			.create("Cool Platformer", new Point(windowSize.w / 2, windowSize.h / 2 - 150), 50)
			.setAlignX("center")
			.setAlignY("middle")
			.setColor("white")

		ConcaveShape.create([
			new Point(0, 0),
			new Point(290, 525),
			new Point(909, 523),
			new Point(1328, -62),
			new Point(1576, 971),
			new Point(-222, 911),
		]).setColor("#960096").draw()

		ConcaveShape.create([
			new Point(0, 0),
			new Point(300, 129),
			new Point(921, 127),
			new Point(1278, 0)
		]).setColor("#be00be").draw()

		if (this.oneTime)
			this.testingShape.updateConvexShapes()

		this.oneTime = false

		if (this.testShape !== null) {
			this.testShape.setColor("#f100f1").setStrokeColor("black").draw()
		}
		let shape = this.testingShape.setStrokeColor("black").setColor("#f100f1")
		
		if (shape.collidesWith(this.testShape))
			shape.setColor("#00ff00")

		shape.draw()

		title.draw()
	}
}