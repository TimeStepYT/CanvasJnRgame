import Rect from "./Rect.js"

export default class Platform extends Rect {
    friction = 0.5
    isMainLevel = false
    
    setMainLevel(isMainLevel) {
        this.isMainLevel = isMainLevel
        return this
    }

    setFriction(friction) {
        this.friction = friction
        return this
    }

}