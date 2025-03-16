import Player from "./Player.js"
import Platform from "./Platform.js"
import Rect from "./Rect.js"
import Level from "./Level.js"
import Point from "./Point.js"
import Mouse from "./Mouse.js"
import Keyboard from "./Keyboard.js"
import DeltaTime from "./DeltaTime.js"
import { canvas } from "../script.js"

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

    rect = null
    showHitboxes = false
    restart = false
    clicking = false
    editMode = false

    levels = []
    levelNumber = 0
    
    level = null
    
    players = []

    dt = new DeltaTime(this)
    mouse = new Mouse(this)
    keyboard = new Keyboard(this)

    createPlayer() {
        let player = new Player(this)
        this.players.push(player)

        return player
    }

    onmousemove(e) {
        this.mouse.onmousemove(e)
    }
    onmousedown(e) {
        this.mouse.onmousedown(e)
    }
    onmouseup(e) {
        this.mouse.onmouseup(e)
    }
    onkeydown(e) {
        this.keyboard.onkeydown(e)
    }
    onkeyup(e) {
        this.keyboard.onkeyup(e)
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
        if (this.mouse.aboutToAdd)
            this.mouse.aboutToAdd.draw()
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
        this.dt.updateDeltaTime()
        this.drawAll()
        requestAnimationFrame(() => this.animate())
    }
}