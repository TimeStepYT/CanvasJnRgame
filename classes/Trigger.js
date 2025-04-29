import Rect from "./Rect.js"

export default class Trigger extends Rect {
    type = 0
    isMainLevel = false
    color = "yellow"
    func = null
    solid = false

    static create(x, y, w, h, func) {
        let res = new Trigger()
        res.x = x
        res.y = y
        res.w = w
        res.h = h
        res.func = func

        return res
    }

    setMainLevel(isMainLevel) {
        this.isMainLevel = isMainLevel
        return this
    }
}