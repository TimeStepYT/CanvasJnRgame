import Rect from "./Rect.js"

export default class Point {
    x = null
    y = null

    constructor(x, y) {
        this.x = x
        this.y = y
    }

    getEdge(otherPoint) {
        return new Point(otherPoint.x - this.x, otherPoint.y - this.y)
    }

    dotProduct(otherVector) {
        return this.x * otherVector.x + this.y * otherVector.y
    }

    getRect() {
        return Rect.create(this.x, this.y, 0, 0)
    }
}