var canvas = document.getElementById("gameCanvas")
var ctx = canvas.getContext("2d")

class Player {
    constructor(game) {
        this.game = game

        this.setPosition(game.level.origin)

        // Alle Aktionen aktivieren, deren Tasten gerade gehalten werden
        if (game.keysDown == null) return
        
        for (let [key, active] of Object.entries(game.keysDown)) {
            if (active)
                this.onkeydown(key)
        }
    }

    game = null
    x = null
    y = null
    xv = 0
    yv = 0
    w = 50
    h = 100
    standHeight = 100
    duckHeight = 50
    accelSpeed = 0.25
    maxSpeed = 7
    gameMode = 0
    gravity = 0.8
    speedFactor = 1
    slowDown = false

    jumpBuffered = false
    spacePress = false

    moveLeft = false
    moveRight = false

    prevPlayer = null

    ducking = false

    floorPlatform = null

    setPosition(point) {
        this.x = point.x
        this.y = point.y

        return this
    }

    onkeydown(key) {
        switch (key) {
            case "d":
                this.moveRight = true
                this.moveLeft = false
                break
            case "a":
                this.moveLeft = true
                this.moveRight = false
                break
            case "s":
                this.duck()
                break
            case " ":
            case "w":
                if (!this.spacePress) this.jumpBuffered = true
                this.spacePress = true
                break
            case "enter":
                if (this.gameMode < 2) this.gameMode++
                else this.gameMode = 0
                break
            default:
            // console.log(e.key)
        }
    }

    onkeyup(key) {
        switch (key) {
            case "d":
                this.moveRight = false
                if (game.keysDown.a)
                    this.moveLeft = true
                break
            case "a":
                this.moveLeft = false
                if (game.keysDown.d)
                    this.moveRight = true
                break
            case "s":
                this.unduck()
                break
            case " ":
            case "w":
                this.spacePress = false
                this.jumpBuffered = false
                break
        }
    }

    getDuckStandHeightDifference() {
        return this.standHeight - this.duckHeight
    }

    handleCollision(platform, dt) {
        const xOffset = this.xv * dt
        const yOffset = this.yv * dt

        const futureX = this.x + xOffset
        const futureY = this.y + yOffset

        const futurePlayerRect = new Rect().create(futureX, futureY, this.w, this.h)

        if (!futurePlayerRect.isColliding(platform)) return false

        const dx = ((futureX + this.w) - (platform.x + platform.w)) / 2 // center of player - center of platform
        const dy = ((futureY + this.h) - (platform.y + platform.h)) / 2 // center of player - center of platform

        const futurePlayerRectY = new Rect().create(this.x, futureY, this.w, this.h)
        const futurePlayerRectX = new Rect().create(futureX, this.y, this.w, this.h)

        let res = false

        if (futurePlayerRectY.isColliding(platform)) {
            if (dy < 0 && this.prevPlayer.y + this.prevPlayer.h <= platform.y) {
                this.y = platform.y - this.h
                this.yv = 0
                if (this.jumpBuffered && this.gravity > 0) this.jump()

                if (this.gravity > 0)
                    this.floorPlatform = platform

                res = true
            } else if (dy > 0 && this.prevPlayer.y >= platform.y + platform.h) {
                this.y = platform.y + platform.h
                this.yv = 0
                if (this.jumpBuffered && this.gravity < 0) this.jump()

                if (this.gravity < 0)
                    this.floorPlatform = platform
                res = true
            }
        }
        if (futurePlayerRectX.isColliding(platform)) {
            if (dx < 0 && this.prevPlayer.x <= platform.x - this.prevPlayer.w) {
                this.x = platform.x - this.w
                this.xv = 0
                res = true
            } else if (dx > 0 && this.prevPlayer.x >= platform.x + platform.w) {
                this.x = platform.x + platform.w
                this.xv = 0
                res = true
            }
        }
        return res
    }

    duck() {
        if (this.ducking) return

        this.h = this.duckHeight

        if (this.gravity > 0)
            this.y = this.y + this.getDuckStandHeightDifference()

        this.ducking = true
        this.speedFactor = 0.5
    }

    unduck() {
        if (this.gravity > 0)
            this.y = this.y - this.getDuckStandHeightDifference()

        this.h = this.standHeight
        this.ducking = false

        for (const platform of game.level.platforms) {
            if (platform.isColliding(this)) {
                this.duck()
                return
            }
        }
        this.speedFactor = 1
    }

    jump() {
        switch (this.gameMode) {
            case 0: // Normal
                this.yv = -15 * this.gravity
                break
            case 1: // GD Ball
                this.gravity *= -1
                this.jumpBuffered = false
                break
            case 2: // GD Spider
                let i = 0;
                while (true) {
                    const futurePlayerY = new Rect().create(this.x, this.y + i * -(this.gravity + 0.2), this.w, this.h)
                    for (const platform of game.level.platforms) {
                        if (!futurePlayerY.isColliding(platform))
                            continue

                        let futureY = 0

                        if (this.gravity > 0) {
                            futureY = platform.y + platform.h
                            if (futureY > this.y)
                                continue
                        } else {
                            futureY = platform.y - this.h
                            if (futureY < this.y)
                                continue
                        }
                        this.y = futureY

                        this.yv = 0
                        this.gravity *= -1
                        this.jumpBuffered = false
                        return
                    }
                    i += 5
                }
        }
    }

    handleFriction(dt) {
        if (this.floorPlatform == null) return

        if (this.floorPlatform.friction == null) {
            console.error("The platform you are standing on has and undefined friction!")
            return
        }

        if (this.xv > 0) {
            this.xv -= this.floorPlatform.friction * dt
            if (this.xv < 0)
                this.xv = 0
        }
        else if (this.xv < 0) {
            this.xv += this.floorPlatform.friction * dt
            if (this.xv > 0)
                this.xv = 0
        }
    }

    handleJumpHeight() {
        if (this.gameMode != 0) return

        if (this.gravity > 0 && this.yv < 0) {
            if (this.spacePress)
                this.gravity = 0.5
            else
                this.gravity = 0.8
        }
        else if (this.gravity < 0 && this.yv > 0)
            if (this.spacePress)
                this.gravity = -0.5
            else
                this.gravity = -0.8
    }

    doMovement(dt) {
        if (this.ducking && !game.keysDown.s)
            this.unduck()

        this.x += this.xv * dt

        this.handleJumpHeight()

        this.yv += this.gravity * dt
        this.y += this.yv * dt

        if (this.moveRight) {
            this.xv += this.accelSpeed * this.speedFactor * dt
            if (this.xv > this.maxSpeed && this.speedFactor == 1)
                this.xv = this.maxSpeed
            else if (this.xv > this.maxSpeed * this.speedFactor && this.slowDown) {
                this.xv = this.maxSpeed * this.speedFactor
            }
        }
        else if (this.moveLeft) {
            this.xv -= this.accelSpeed * this.speedFactor * dt
            if (this.xv < -this.maxSpeed && this.speedFactor == 1)
                this.xv = -this.maxSpeed
            else if (this.xv < -this.maxSpeed * this.speedFactor && this.slowDown) {
                this.xv = -this.maxSpeed * this.speedFactor
            }
        }

        if ((this.moveRight && this.xv < 0) ||
            (this.moveLeft && this.xv > 0) ||
            (!this.moveLeft && !this.moveRight) ||
            (Math.abs(this.xv) > Math.abs(this.maxSpeed * this.speedFactor)))
            this.handleFriction(dt)

        if (game.showHitboxes) {
            new Rect().create(this.x, this.y, this.w, this.h)
                .setColor("red")
                .drawOutline()
            new Rect().create(this.x, this.y, this.w, this.h)
                .setColor("blue")
                .drawOutline()
        }
    }

    drawPlayer() {
        this.prevPlayer = this.getPlayerObject()
        this.doMovement(game.dt)

        let wasStanding = this.floorPlatform != null
        this.floorPlatform = null

        for (let platform of game.level.platforms) {
            const steps = 4 // Mario 64 style splitting up the positions every frame for more accuracy
            for (let i = 0; i < steps; i++) {
                if (this.handleCollision(platform, game.dt * (i / steps))) {
                    break
                }
            }
        }
        let wentAirborne = wasStanding && this.floorPlatform == null

        if (wentAirborne && this.speedFactor != 1) this.slowDown = true
        else if (this.floorPlatform != null) this.slowDown = false

        if (this.floorPlatform != null && game.showHitboxes) {
            this.floorPlatform.setColor("blue").draw()
            this.floorPlatform.setColor("black")
        }

        if (this.y > canvas.height) {
            let index = game.players.indexOf(this)
            if (index >= 0)
                game.players.splice(index, 0)
            else console.log("noo")
        }

        let color = "black"
        switch (this.gameMode) {
            case 0:
                color = "lime"
                break
            case 1:
                color = "red"
                break
            case 2:
                color = "#880088"
                break
        }

        const playerRect = new Rect().fromObject(this).setColor(color)

        if (game.showHitboxes) playerRect.drawOutline()
        else playerRect.draw()
    }

    getPlayerObject() {
        return {
            x: this.x,
            y: this.y,
            w: this.w,
            h: this.h,
            xv: this.xv,
            yv: this.yv
        }
    }
}

class Level {
    platforms = []
    origin = null

    create(platforms, origin) {
        this.platforms = platforms
        this.origin = origin

        return this
    }
}

class Point {
    x = null
    y = null

    create(x, y) {
        this.x = x
        this.y = y

        return this
    }
}

class Rect {
    x = null
    y = null
    w = null
    h = null
    color = "black"

    hasNaN() {
        if (isNaN(this.x) || isNaN(this.y) || isNaN(this.w) || isNaN(this.h)) {
            console.log(this)
            console.error("NaN detected")
            return true
        }
        return false
    }
    create(x, y, w, h) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h

        this.hasNaN()
        return this
    }

    fromObject(obj) {
        this.x = obj.x
        this.y = obj.y
        this.w = obj.w
        this.h = obj.h

        this.hasNaN()
        return this
    }

    isColliding(rect) {
        if (rect == null) {
            console.error("The rect to be checked with is not declared")
            return false
        }
        if (this.x == null && this.y == null && this.w == null && this.h == null) {
            console.error("This rect is not defined")
            return false
        }
        return (
            this.y + this.h > rect.y &&
            this.y < rect.y + rect.h &&
            this.x < rect.x + rect.w &&
            this.x + this.w > rect.x
        );
    }

    draw() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.w, this.h)
        return this
    }

    drawOutline() {
        ctx.strokeStyle = this.color
        ctx.strokeRect(this.x, this.y, this.w, this.h)
        return this
    }

    setColor(color) {
        this.color = color
        return this
    }
}

class Platform extends Rect {
    constructor(x, y, w, h) {
        super(x, y, w, h)
    }

    friction = 0.5
    isMainLevel = false

    setMainLevel(isMainLevel) {
        this.isMainLevel = isMainLevel
        return this
    }

    setFriction(friction) {
        this.friction = friction
        return this
    }

}

class Game {
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

    showHitboxes = false
    restart = false
    xPos = 0
    yPos = 0
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
            this.aboutToAdd.w *= -1
            this.aboutToAdd.x -= this.aboutToAdd.w
        }
        if (this.aboutToAdd.h < 0) {
            this.aboutToAdd.h *= -1
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
var game = new Game()
// game.showHitboxes = true