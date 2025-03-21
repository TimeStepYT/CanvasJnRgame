import Rect from "./Rect.js"
import Point from "./Point.js"
import { canvas } from "../script.js"

export default class Button extends Rect {
    constructor(game) {
        super()
        this.game = game
    }

    content = []

    func = null
    game = null

    mouseOver() {
        canvas.style = "cursor: pointer;"
    }

    onClick() {
        if (this.func == null) return

        this.func()
    }
    setFunction(func) {
        this.func = func

        return this
    }

    draw() {
        if (this.game.showHitboxes)
            super.setColor("white").drawOutline()

        for (const elm of this.content) {
            elm.offsetPos = new Point(this.x, this.y)
            elm.draw()
        }

        return this
    }
}