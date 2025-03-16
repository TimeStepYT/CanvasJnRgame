import {Game, Rect} from "./script.js"

export default class Player {
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
    normalGravity = 0.8
    holdGravity = 0.5
    gravity = this.normalGravity
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
                if (this.game.keysDown.a)
                    this.moveLeft = true
                break
            case "a":
                this.moveLeft = false
                if (this.game.keysDown.d)
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

        for (const platform of this.game.level.platforms) {
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
                this.gravity = -this.gravity
                this.jumpBuffered = false
                break
            case 2: // GD Spider
                let i = 0;
                while (true) {
                    const futurePlayerY = new Rect().create(this.x, this.y + i * -(this.gravity + 0.2), this.w, this.h)
                    for (const platform of this.game.level.platforms) {
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
                        this.gravity = -this.gravity
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

        if (this.gravity > 0 && this.yv <= 0) {
            if (this.spacePress) {
                console.log("Working as expected")
                this.gravity = this.holdGravity
            }
            else
                this.gravity = this.normalGravity
        }
        else if (this.gravity < 0 && this.yv >= 0)
            if (this.spacePress)
                this.gravity = -this.holdGravity
            else
                this.gravity = -this.normalGravity
    }

    doMovement(dt) {
        if (this.ducking && !this.game.keysDown.s)
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

        if (this.game.showHitboxes) {
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
        this.doMovement(this.game.dt)

        let wasStanding = this.floorPlatform != null
        this.floorPlatform = null

        for (let platform of this.game.level.platforms) {
            const steps = 4 // Mario 64 style splitting up the positions every frame for more accuracy
            for (let i = 0; i < steps; i++) {
                if (this.handleCollision(platform, this.game.dt * (i / steps))) {
                    break
                }
            }
        }
        let wentAirborne = wasStanding && this.floorPlatform == null

        if (wentAirborne && this.speedFactor != 1) this.slowDown = true
        else if (this.floorPlatform != null) this.slowDown = false

        if (this.floorPlatform != null && this.game.showHitboxes) {
            this.floorPlatform.setColor("blue").draw()
            this.floorPlatform.setColor("black")
        }

        if (this.y > this.game.canvas.height) {
            let index = this.game.players.indexOf(this)
            if (index >= 0)
                this.game.players.splice(index, 0)
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

        if (this.game.showHitboxes) playerRect.drawOutline()
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