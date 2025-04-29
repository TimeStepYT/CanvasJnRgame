import Rect from "./Rect.js"

export default class Point {
    x = null
    y = null

    constructor(x, y) {
        this.x = x
        this.y = y
    }

    getRect() {
        return Rect.create(this.x, this.y, 0, 0)
    }
}