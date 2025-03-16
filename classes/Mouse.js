import Rect from "./Rect.js"
import Platform from "./Platform.js"
import {canvas} from "../script.js"

export default class Mouse {
    constructor(game) {
        this.game = game
    }

    game = null

    clicking = false

    xPos = null
    yPos = null

    aboutToAdd = null

    onmousemove(e) {
        this.game.rect = canvas.getBoundingClientRect()
        let rect = this.game.rect
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
        if (this.game.editMode)
            ataPlatform.setMainLevel(true)

        for (let player of this.game.players) {
            if (ataPlatform.isColliding(player)) {
                canCreateRect = false
                break
            }
        }
        if (canCreateRect)
            this.game.level.platforms.push(ataPlatform.setColor("black"))

        delete this.aboutToAdd
    }
}