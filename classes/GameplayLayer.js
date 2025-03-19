import Layer from "./Layer.js"
import Level from "./Level.js"
import Platform from "./Platform.js"
import FinishTrigger from "./FinishTrigger.js"
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

	players = []

	rect = null

	createPlatform() {
		const gameWindow = new Rect().create(0, 0, canvas.width, canvas.height)

		if (this.rect.w == 5 && this.rect.h == 5) return
		if (!this.rect.isColliding(gameWindow)) return

		let canCreateRect = true
		let platform = new Platform().fromObject(this.rect)

		if (this.game.editMode) platform.setMainLevel(true)

		if (this.game.players != null)
			for (const player of this.game.players) {
				if (platform.isColliding(player)) {
					canCreateRect = false
					break
				}
			}

		if (canCreateRect) {
			this.game.forLayers(layer => {
				layer.level.platforms.push(platform.setColor("black"))
			}, GameplayLayer)
		}
	}

	onmousedown(e) {
		this.rect = new Rect().create(this.game.mouse.pos.x, this.game.mouse.pos.y, 0, 0).setColor("blue")
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
		this.players.push(player)

		return player
	}

	switchLevel(level) {
		this.levelNumber = level % this.levels.length
		this.initPlatforms()
		this.players = [this.createPlayer().setPosition(this.level.origin)]
	}

	initLevels() {
		let level = new Level().create([
			new Platform().create(0, 699, 1315, 25),
			new Platform().create(-13, -11, 29, 783),
			new Platform().create(1265, -23, 88, 833),
			new Platform().create(-25, -46, 1401, 63),
			new Platform().create(0, 379, 1163, 126),
			new Platform().create(238, 627, 79, 132),
			new Platform().create(451, 484, 44, 47),
			new Platform().create(680, 638, 53, 65),
			new Platform().create(967, 508, 30, 36),
			new Platform().create(961, 445, 64, 72),
			new Platform().create(175, 156, 1083, 80),
			new Platform().create(1238, 158, 74, 64),
			new Platform().create(606, 340, 41, 72),
			new Platform().create(139, 186, 57, 20),
			new Platform().create(1416, 313, 20, 20),
			new FinishTrigger().create(1108, 65, 98, 50)
		],
			new Point(102, 599)
		)
		this.levels.push(level)
		level = new Level().create([
			new Platform().create(0, 699, 1315, 25),
			new Platform().create(-13, -11, 29, 783),
			new Platform().create(1243, 310, 56, 421),
			new Platform().create(334, 310, 915, 46),
			new Platform().create(3, 497, 1074, 53),
			new Platform().create(1200, 619, 53, 93),
			new Platform().create(1069, 538, 60, 12),
			new Platform().create(15, 417, 90, 81),
			new Platform().create(13, -56, 1272, 115),
			new Platform().create(-1, 36, 60, 443),
			new Platform().create(50, 30, 82, 104),
			new Platform().create(213, 342, 283, 12),
			new Platform().create(758, 292, 562, 23),
			new FinishTrigger().create(1201, 59, 32, 233)
		],
			new Point(42, 599)
		)
		this.levels.push(level)
		level = new Level().create([
			new Platform().create(0, 699, 1315, 25),
			new Platform().create(-9, -7, 1291, 16),
			new FinishTrigger().create(604, 430, 99, 98)
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
		const newLevel = new Level().fromObject(level)
		this.level = newLevel
	}

	drawPlatforms() {
		if (this.level == null) return

		for (let i of this.level.platforms) {
			i.draw()
		}
		if (this.rect)
			this.rect.draw()
	}

	drawPlayers() {
		for (let i = 0; i < this.players.length; i++) {
			let player = this.players[i]
			player.drawPlayer()
			if (player.dead) {
				this.players.splice(i, 1)
				i--
			}
		}
	}

	drawBackground(color) {
		return new Rect().create(0, 0, canvas.width, canvas.height).setColor(color).draw()
	}

	draw() {
		this.drawBackground("#0098ff")
		this.drawPlatforms()
		this.drawPlayers()
	}
}