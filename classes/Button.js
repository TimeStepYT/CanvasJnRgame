import Rect from "./Rect.js"

export default class Button extends Rect {
    constructor(game) {
        super()
        this.game = game
    }
    
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
}