import Rect from "./Rect.js"

export default class Trigger extends Rect {
    type = 0
    isMainLevel = false
    color = "yellow"
    func = null

    create(x, y, w, h, func) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.func = func

        return this
    }

    setMainLevel(isMainLevel) {
        this.isMainLevel = isMainLevel
        return this
    }
}