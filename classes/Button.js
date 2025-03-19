import Rect from "./Rect.js"
import Point from "./Point.js"

export default class Button extends Rect {
    constructor(game) {
        super()
        this.game = game
    }

    content = []

    func = null
    game = null

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