import Rect from "./Rect.js"

export default class Platform extends Rect {
    friction = 0.5
    isMainLevel = false
    solid = true
    
    static create(x, y, w, h) {
        let res = new Platform()

        res.x = x
        res.y = y
        res.w = w
        res.h = h

        return res
    }

    setMainLevel(isMainLevel) {
        this.isMainLevel = isMainLevel
        return this
    }

    setFriction(friction) {
        this.friction = friction
        return this
    }

}