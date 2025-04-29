import { canvas } from "../script.js"
import Rect from "./Rect.js"
import Entity from "./Entity.js"
import Trigger from "./Trigger.js"

export default class Player extends Entity {
    constructor(layer) {
        super(layer)

        this.game = layer.game
        this.layer = layer
        this.setPosition(layer.level.origin)

        // Alle Aktionen aktivieren, deren Tasten gerade gehalten werden
        if (layer.game.keyboard.keysDown == null) return

        for (let [key, active] of Object.entries(layer.game.keyboard.keysDown)) {
            if (active)
                this.onkeydown(key)
        }
    }

    w = 50
    h = 100
    standHeight = 100
    duckHeight = 50
    accelSpeed = 0.25
    jumpHeight = 13
    gameMode = 0
    normalGravity = 0.8
    holdGravity = 0.3
    gravity = this.normalGravity
    changeGravity = false
    ducking = false
    slowDown = false

    jumpBuffered = false
    jumpHeld = false
    moveLeft = false
    moveRight = false

    hitChecks = []

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
                if (!this.jumpHeld) this.jumpBuffered = true
                this.jumpHeld = true
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
                if (this.game.keyboard.keysDown.a)
                    this.moveLeft = true
                break
            case "a":
                this.moveLeft = false
                if (this.game.keyboard.keysDown.d)
                    this.moveRight = true
                break
            case "s":
                this.unduck()
                break
            case " ":
            case "w":
                this.jumpHeld = false
                this.jumpBuffered = false
                break
        }
    }

    getDuckStandHeightDifference() {
        return this.standHeight - this.duckHeight
    }

    standAction(touchingTop) {
        if (!this.jumpBuffered) return

        if (this.gravity > 0 && touchingTop) this.jump()
        else if (this.gravity < 0 && !touchingTop) this.jump()
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

        for (const platform of this.layer.level.platforms) {
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
                this.yv = -this.jumpHeight * this.gravity
                this.changeGravity = true
                break
            case 1: // GD Ball
                this.gravity = -this.gravity
                this.jumpBuffered = false
                break
            case 2: // GD Spider
                let i = 0;
                while (true) {
                    const futurePlayer = Rect.create(this.x, this.y + i * -(this.gravity + 0.2), this.w, this.h)
                    if (!futurePlayer.isColliding(this.game.windowSize.getRect())) break
                    for (const platform of this.layer.level.platforms) {
                        if (!futurePlayer.isColliding(platform))
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

    collidingAction(platform) {
        if (platform instanceof Trigger) {
            if (platform.func == null) return true
            platform.func(this)
            return true
        }
        return false
    }

    handleJumpHeight() {
        if (this.gameMode != 0 || !this.changeGravity) {
            this.gravity = this.gravity > 0 ? this.normalGravity : -this.normalGravity
            return
        }

        if (this.gravity > 0) {
            if (this.jumpHeld && this.yv < 0)
                this.gravity = this.holdGravity
            else {
                this.changeGravity = false
                this.gravity = this.normalGravity
            }
        }
        else if (this.gravity < 0)
            if (this.jumpHeld && this.yv > 0)
                this.gravity = -this.holdGravity
            else {
                this.changeGravity = false
                this.gravity = -this.normalGravity
            }
    }

    doMovement(dt) {
        if (this.ducking && !this.game.keyboard.keysDown.s)
            this.unduck()

        this.x += this.xv * dt

        this.handleJumpHeight()

        this.yv += this.gravity * dt

        if (this.gravity > 0)
            this.yv = Math.min(this.yv, this.terminalVelocity)
        else if (this.gravity < 0)
            this.yv = Math.max(this.yv, -this.terminalVelocity)

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
            Rect.create(this.x, this.y, this.w, this.h)
                .setColor("red")
                .drawOutline()
            Rect.create(this.x, this.y, this.w, this.h)
                .setColor("blue")
                .drawOutline()
        }
    }

    draw() {
        this.prevEnt = this.getEntityObject()
        this.doMovement(this.game.dt.get())

        let wasStanding = this.floorPlatform != null
        this.floorPlatform = null

        this.checkCollision(this.layer.level.platforms)
        this.checkCollision(this.layer.level.checks)

        let wentAirborne = wasStanding && this.floorPlatform == null

        if (wentAirborne && this.speedFactor != 1) this.slowDown = true
        else if (this.floorPlatform != null) this.slowDown = false

        if (this.floorPlatform != null && this.game.showHitboxes) {
            this.floorPlatform.setColor("blue").draw()
            this.floorPlatform.setColor("black")
        }

        if (!this.game.windowSize.getRect().isCollidingY(this))
            this.dead = true

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

        const playerRect = Rect.fromObject(this).setColor(color)

        if (this.game.showHitboxes) playerRect.drawOutline()
        else playerRect.draw()
    }
}