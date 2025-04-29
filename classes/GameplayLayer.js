import Layer from "./Layer.js"
import Level from "./Level.js"
import Text from "./Text.js"
import Platform from "./Platform.js"
import FinishTrigger from "./FinishTrigger.js"
import CheckTrigger from "./CheckTrigger.js"
import Trigger from "./Trigger.js"
import Rect from "./Rect.js"
import Point from "./Point.js"
import Player from "./Player.js"
import { canvas } from "../script.js"

export default class GameplayLayer extends Layer {
	constructor(game) {
		super(game)

		this.initLevels()
		this.createPlayer()
	}

	editMode = false

	levelNumber = 0
	levels = []
	level = null

	entities = []

	rect = null

	createPlatform() {
		if (this.rect.w == 5 && this.rect.h == 5) return
		if (!this.rect.isColliding(this.game.windowSize.getRect())) return

		let canCreateRect = true
		let platform = new Platform().fromObject(this.rect)

		if (this.game.editMode) platform.setMainLevel(true)

		if (this.entities != null) {
			for (const entity of this.entities) {
				if (platform.isColliding(entity)) {
					canCreateRect = false
					break
				}
			}
		}

		if (canCreateRect) {
			this.game.forLayers(layer => {
				layer.level.platforms.push(platform.setColor("black"))
			}, GameplayLayer)
		}
	}

	onmousedown(e) {
		this.rect = Rect.create(this.game.mouse.pos.x, this.game.mouse.pos.y, 0, 0).setColor("blue")
	}

	onmousemove(e) {
		let mouse = this.game.mouse
		if (mouse.clicking && this.rect != null) {
			this.rect.w = mouse.pos.x - this.rect.x
			this.rect.h = mouse.pos.y - this.rect.y
		}
	}

	onmouseup(e) {
		if (this.rect == null) return

		if (this.rect.w < 0) {
			this.rect.w = -this.rect.w
			this.rect.x -= this.rect.w
		}
		if (this.rect.h < 0) {
			this.rect.h = -this.rect.h
			this.rect.y -= this.rect.h
		}
		if (this.rect.w < 5) this.rect.w = 5
		if (this.rect.h < 5) this.rect.h = 5

		this.rect.x = Math.round(this.rect.x)
		this.rect.y = Math.round(this.rect.y)
		this.rect.h = Math.round(this.rect.h)
		this.rect.w = Math.round(this.rect.w)

		this.createPlatform()

		this.rect = null
	}

	createPlayer() {
		let player = new Player(this)
		this.entities.push(player)

		return player
	}

	switchLevel(level) {
		this.levelNumber = level % this.levels.length
		this.initPlatforms()
		this.entities = [this.createPlayer().setPosition(this.level.origin)]
	}

	initLevels() {
		let level = Level.create(
			[
				Platform.create(0, 699, 1315, 25),
				Platform.create(-13, -11, 29, 783),
				Platform.create(1265, -23, 88, 833),
				Platform.create(-25, -46, 1401, 63),
				Platform.create(0, 379, 1163, 126),
				Platform.create(238, 627, 79, 132),
				Platform.create(451, 484, 44, 47),
				Platform.create(680, 638, 53, 65),
				Platform.create(967, 508, 30, 36),
				Platform.create(961, 445, 64, 72),
				Platform.create(175, 156, 1083, 80),
				Platform.create(1238, 158, 74, 64),
				Platform.create(606, 340, 41, 72),
				Platform.create(139, 186, 57, 20),
				Platform.create(1416, 313, 20, 20),
				FinishTrigger.create(1108, 65, 98, 50)
			],
			new Point(102, 599)
		)
		this.levels.push(level)
		level = Level.create(
			[
				Platform.create(0, 699, 1315, 25),
				Platform.create(-13, -11, 29, 783),
				Platform.create(1243, 310, 56, 421),
				Platform.create(334, 310, 915, 46),
				Platform.create(3, 497, 1074, 53),
				Platform.create(1200, 619, 53, 93),
				Platform.create(1069, 538, 60, 12),
				Platform.create(15, 417, 90, 81),
				Platform.create(13, -56, 1272, 115),
				Platform.create(-1, 36, 60, 443),
				Platform.create(50, 30, 82, 104),
				Platform.create(213, 342, 283, 12),
				Platform.create(758, 292, 562, 23),
				FinishTrigger.create(1201, 59, 32, 233)
			],
			new Point(42, 599)
		)
		this.levels.push(level)

		level = Level.create(
			[
				Platform.create(98, 706, 99, 66),
				Platform.create(570, 542, 50, 32),
				Platform.create(1104, 453, 59, 40),
				Platform.create(582, 569, 26, 177),
				Platform.create(1121, 489, 25, 276),
				Platform.create(1247, 323, 6, 5),
				Platform.create(945, 263, 7, 5),
				Platform.create(512, 222, 8, 5),
				Platform.create(45, 201, 7, 9),
				Platform.create(34, 188, 10, 10),
				Platform.create(22, 175, 11, 9),
				Platform.create(53, 189, 11, 11),
				Platform.create(63, 178, 10, 10),
				Platform.create(45, 103, 8, 102),
				Platform.create(16, 30, 10, 11),
				Platform.create(50, 29, 13, 14),
				Platform.create(25, 65, 10, 10),
				Platform.create(35, 65, 10, 11),
				Platform.create(46, 55, 9, 11),
				FinishTrigger.create(42, 316, 11, 6),
			],
			new Point(124, 606),
			[
				CheckTrigger.create(1247, 318, 6, 5)
			]
		)
		this.levels.push(level)

		level = Level.create([
			Platform.create(0, 699, 1315, 25),
			Platform.create(-9, -7, 1291, 16),
			FinishTrigger.create(604, 430, 99, 98)
		],
			new Point(42, 599)
		)
		this.levels.push(level)

		this.initPlatforms()

		for (let level of this.levels) {
			for (const platform of level.platforms)
				platform.setMainLevel(true)
		}
	}

	initPlatforms() {
		const level = this.levels[this.levelNumber]
		const newLevel = Level.fromObject(level)
		this.level = newLevel
	}

	drawPlatforms() {
		if (this.level == null) return

		for (let platform of this.level.platforms) {
			platform.draw()
		}
		for (let check of this.level.checks) {
			check.draw()
		}
		if (this.rect)
			this.rect.draw()
	}

	drawEntities() {
		for (let i = 0; i < this.entities.length; i++) {
			let entity = this.entities[i]
			entity.draw()
			if (entity.dead) {
				this.entities.splice(i, 1)
				i--
			}
		}
	}

	drawBackground(color) {
		return Rect.create(0, 0, canvas.width, canvas.height).setColor(color).draw()
	}

	draw() {
		this.drawBackground("#0098ff")
		this.drawPlatforms()
		this.drawEntities()
	}
}