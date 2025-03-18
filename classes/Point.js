import Rect from "./Rect.js"

export default class Point {
    x = null
    y = null

    create(x, y) {
        this.x = x
        this.y = y

        return this
    }

    getRect() {
        return new Rect().create(this.x, this.y, 0, 0)
    }
}