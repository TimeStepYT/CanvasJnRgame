import Rect from "./Rect.js"
import Platform from "./Platform.js"
import { canvas } from "../script.js"

export default class Mouse {
    constructor(game) {
        this.game = game
    }

    game = null

    clicking = false

    xPos = null
    yPos = null

    rect = null

    onmousemove(e) {
        this.game.rect = canvas.getBoundingClientRect()
        let rect = this.game.rect
        this.xPos = e.clientX - rect.left - 2
        this.yPos = e.clientY - rect.top - 2

        if (this.clicking) {
            this.rect.w = this.xPos - this.rect.x
            this.rect.h = this.yPos - this.rect.y
        }
    }
    onmousedown(e) {
        switch (e.button) {
            case 0:
                this.clicking = true
                this.rect = new Rect().create(this.xPos, this.yPos, 0, 0).setColor("blue")
                break
        }
    }
    onmouseup(e) {
        switch (e.button) {
            case 0:
                this.clicking = false
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
                break
        }
    }

    createPlatform() {
        const gameWindow = new Rect().create(0, 0, canvas.width, canvas.height)

        if (this.rect.w == 5 && this.rect.h == 5) return
        if (!this.rect.isColliding(gameWindow)) return

        let canCreateRect = true
        let platform = new Platform().fromObject(this.rect)

        if (this.game.editMode) platform.setMainLevel(true)

        for (const player of this.game.players) {
            if (platform.isColliding(player)) {
                canCreateRect = false
                break
            }
        }

        if (canCreateRect)
            this.game.level.platforms.push(platform.setColor("black"))
    }
}