import Player from "./Player.js"
import Platform from "./Platform.js"
import Rect from "./Rect.js"
import Level from "./Level.js"
import Point from "./Point.js"
import { canvas } from "./script.js"

export default class Game {
    constructor() {
        onkeydown = e => this.onkeydown(e)
        onkeyup = e => this.onkeyup(e)
        onmousemove = e => this.onmousemove(e)
        onmousedown = e => this.onmousedown(e)
        onmouseup = e => this.onmouseup(e)

        this.initLevels()

        this.createPlayer()

        requestAnimationFrame(() => this.animate())
    }

    canvas = null
    ctx = null

    showHitboxes = false
    restart = false
    xPos = null
    yPos = null
    clicking = false
    aboutToAdd = null
    editMode = false

    keysDown = {}

    now = 0
    dt = 2.4
    lastUpdated = 0

    levels = []
    levelNumber = 0

    level = null

    players = []

    createPlayer() {
        let player = new Player(this)
        this.players.push(player)

        return player
    }

    onmousemove(e) {
        this.rect = canvas.getBoundingClientRect()
        let rect = this.rect
        this.xPos = e.clientX - rect.left - 2
        this.yPos = e.clientY - rect.top - 2

        if (this.clicking) {
            this.aboutToAdd.w = this.xPos - this.aboutToAdd.x
            this.aboutToAdd.h = this.yPos - this.aboutToAdd.y
        }
    }
    onmousedown(e) {
        this.clicking = true
        this.aboutToAdd = new Rect().create(this.xPos, this.yPos, 0, 0).setColor("blue")
    }
    onmouseup(e) {
        this.clicking = false
        if (this.aboutToAdd.w < 0) {
            this.aboutToAdd.w = -this.aboutToAdd.w
            this.aboutToAdd.x -= this.aboutToAdd.w
        }
        if (this.aboutToAdd.h < 0) {
            this.aboutToAdd.h = -this.aboutToAdd.h
            this.aboutToAdd.y -= this.aboutToAdd.h
        }
        if (this.aboutToAdd.w < 5) this.aboutToAdd.w = 5
        if (this.aboutToAdd.h < 5) this.aboutToAdd.h = 5

        this.aboutToAdd.x = Math.round(this.aboutToAdd.x)
        this.aboutToAdd.y = Math.round(this.aboutToAdd.y)
        this.aboutToAdd.h = Math.round(this.aboutToAdd.h)
        this.aboutToAdd.w = Math.round(this.aboutToAdd.w)

        let canCreateRect = true

        let ataPlatform = new Platform().fromObject(this.aboutToAdd)
        if (this.editMode)
            ataPlatform.setMainLevel(true)

        for (let player of this.players) {
            if (ataPlatform.isColliding(player)) {
                canCreateRect = false
                break
            }
        }
        if (canCreateRect)
            this.level.platforms.push(ataPlatform.setColor("black"))

        delete this.aboutToAdd
    }
    onkeydown(e) {
        let key = e.key.toLowerCase()
        this.keysDown[key] = true
        this.players.forEach(p => p.onkeydown(key))
        switch (key) {
            case "r":
                if (!this.level.platforms[this.level.platforms.length - 1].isMainLevel || this.editMode)
                    this.level.platforms.pop()
                break
            case "p":
                this.createPlayer()
                break
            default:
            // console.log(e.key)
        }
    }
    onkeyup(e) {
        let key = e.key.toLowerCase()
        this.keysDown[key] = false
        this.players.forEach(p => p.onkeyup(key))
    }

    updateDeltaTime() {
        this.now = performance.now()
        this.dt = ((this.now - this.lastUpdated) / 10) * 0.6
        if (this.dt > 4) this.dt = 4 // Don't explode when tabbing out
        // this.dt = 0.2
        this.lastUpdated = this.now
    }

    switchLevel(level) {
        this.levelNumber = level % this.levels.length
        this.players = []
        this.initPlatforms()
        this.players.push(new Player().setPosition(this.level.origin))
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
            new Platform().create(1108, 65, 98, 50),
            new Platform().create(1416, 313, 20, 20)
        ],
            new Point().create(102, 599)
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
            new Platform().create(758, 292, 562, 23)
        ],
            new Point().create(42, 599)
        )
        this.levels.push(level)

        this.initPlatforms()
    }

    initPlatforms() {
        this.level = this.levels[this.levelNumber]

        for (const platform of this.level.platforms) {
            platform.setMainLevel(true)
        }
    }

    drawPlatforms() {
        for (let i of this.level.platforms) {
            i.draw()
        }
        if (this.aboutToAdd)
            this.aboutToAdd.draw()
    }

    drawPlayers() {
        for (let player of this.players) {
            player.drawPlayer()
        }
    }

    drawAll() {
        new Rect().create(0, 0, canvas.width, canvas.height).setColor("#0098ff").draw()
        this.drawPlatforms()
        this.drawPlayers()
    }

    animate() {
        this.updateDeltaTime()
        this.drawAll()
        requestAnimationFrame(() => this.animate())
    }
}