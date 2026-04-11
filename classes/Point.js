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

    getLength() {
        return Math.sqrt(this.x ** 2 + this.y ** 2)
    }

    getNormalizedWithLength(length) {
        const normalizedX = this.x / length
        const normalizedY = this.y / length
        const normalizedPoint = new Point(normalizedX, normalizedY)

        return normalizedPoint
    }

    getNormalized() {
        const length = this.getLength()
    
        return this.getNormalizedWithLength(length)
    }

    getDotProduct(otherVector) {
        return this.x * otherVector.x + this.y * otherVector.y
    }

    getRect() {
        return Rect.create(this.x, this.y, 0, 0)
    }
}