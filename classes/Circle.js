import Point from "./Point.js"
import {ctx} from "../script.js"
import ConvexShape from "./ConvexShape.js"

export default class Circle {
    #centerPoint = null
    #radius = 0
    
    #color = "black"
    #strokeColor = null

    setPosition(x, y) {
        this.#centerPoint = new Point(x, y)
        return this
    }

    setRadius(radius) {
        this.#radius = Math.abs(radius)
        return this
    }

    getRadius() {
        return this.#radius
    }

    setColor(color) {
        this.#color = color
        return this
    }

    setStrokeColor(color) {
        this.#strokeColor = color
        return this
    }

    #collidesWithCircle(circle) {
        const distance = this.#centerPoint.getEdge(circle.#centerPoint)
        return distance < this.getRadius() + circle.getRadius()
    }

    #collidesWithConcaveShape(concaveShape) {
        return concaveShape.collidesWith(this)
    }

    #collidesWithConvexShape(convexShape) {
        return convexShape.collidesWith(this)
    }

    #collidesWithRect(rect) {
        return ConvexShape.createFromRect(rect).collidesWith(this)
    }

    collidesWith(otherShape) {
        const typeName = otherShape.constructor.name

        switch (typeName) {
            case "Circle":
                return this.#collidesWithCircle(otherShape)
            case "ConcaveShape":
                return this.#collidesWithConcaveShape(otherShape)
            case "ConvexShape":
                return this.#collidesWithConvexShape(otherShape)
            case "Rect":
                return this.#collidesWithRect(otherShape)   
            default:
                console.warn("Unhandled collision type")
                return false
        }
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.#centerPoint.x, this.#centerPoint.y, this.#radius, 0, 2 * Math.PI)
        ctx.fill()
    }
}