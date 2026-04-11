import Point from "./Point.js"
import Triangle from "./Triangle.js"
import Utils from "./Utils.js"
import {ctx} from "../script.js"

export default class ConvexShape extends Triangle {
    points = []
    #color = "black"
    #strokeColor = null

    #smallestOverlap = Infinity
    #smallestAxis = null
    #lastOtherShape = null

    static create(points) {
        let ret = new ConvexShape()
        ret.points = points

        return ret
    }

    static createFromRect(rect) {
        let ret = new ConvexShape()
        ret.points = [
            Point(rect.x, rect.y),
            Point(rect.x + rect.w, rect.y),
            Point(rect.x + rect.w, rect.y + rect.h),
            Point(rect.x, rect.y + rect.h)
        ]
        return ret
    }

    setColor(color) {
        this.#color = color
        return this
    }

    setStrokeColor(color) {
        this.#strokeColor = color
        return this
    }

    addPoints(points) {
        this.points.push(...points)
    }

    #collisionPart(points) {
        for (let i = 0; i < points.length; i++) {
            const point = points[i]
            const nextPoint = points[(i + 1) % points.length]
            const edge = point.getEdge(nextPoint)
            const normal = new Point(-edge.y, edge.x)

            const axisLength = normal.getLength()

            let projectedA = []
            let projectedB = []

            for (let vertex of this.points) {
                projectedA.push(normal.getDotProduct(vertex) / axisLength)
            }
            for (let vertex of this.#lastOtherShape.points) {
                projectedB.push(normal.getDotProduct(vertex) / axisLength)
            }


            const minA = Math.min(...projectedA)
            const minB = Math.min(...projectedB)
            const maxA = Math.max(...projectedA)
            const maxB = Math.max(...projectedB)

            const overlap = Math.min(maxA, maxB) - Math.max(minA, minB)

            if (this.#smallestOverlap > overlap) {
                this.#smallestOverlap = overlap
                this.#smallestAxis = normal
            }

            if (maxA < minB || minA > maxB)
                return false
        }

        return true
    }

    getArea() {
        let area = 0

        for (let i = 0; i < this.points.length; i++) {
            const point = this.points[i]
            const nextPoint = this.points[(i + 1) % this.points.length]

            area += (nextPoint.x - point.x) * (nextPoint.y + point.y)
        }

        return area
    }

    getWindingDirection() {
        const area = this.getArea()

        if (area < 0)
            return 1

        return -1
    }

    collidesWith(otherShape) {
        this.#smallestOverlap = Infinity
        this.#smallestAxis = null
        this.#lastOtherShape = otherShape

        const thisShapeSA = this.#collisionPart(this.points)
        if (!thisShapeSA)
            return false
        
        const otherShapeSA = this.#collisionPart(otherShape.points)
        if (!otherShapeSA)
            return false


        return true
    }

    getCenter() {
        let sumX = 0
        let sumY = 0

        for (let point of this.points) {
            sumX += point.x
            sumY += point.y
        }

        const x = sumX / this.points.length
        const y = sumY / this.points.length

        return new Point(x, y)
    }

    getDirectionToPoint(point) {
        return this.getCenter().getEdge(point)
    }

    getDirectionToShape(shape) {
        return this.getDirectionToPoint(shape.getCenter())
    }

    getMTV() {
        if (this.#smallestAxis === null)
            return null

        const axis = this.#smallestAxis.getNormalized()
        const overlap = this.#smallestOverlap
        
        // Adjust direction
        const direction = this.getDirectionToShape(this.#lastOtherShape)
        if (direction.getDotProduct(axis) < 0) {
            axis.x *= -1
            axis.y *= -1
        }
        
        const x = axis.x * overlap
        const y = axis.y * overlap

        return new Point(x, y)
    }

    draw() {
        if (this.points.length == 0)
            return

        ctx.fillStyle = this.#color
        if (this.#strokeColor !== null)
            ctx.strokeStyle = this.#strokeColor
        
        ctx.beginPath()
        ctx.moveTo(this.points[0].x, this.points[0].y)

        for (let i = 0; i < this.points.length; i++) {
            const nextIndex = (i + 1) % this.points.length
            const nextPoint = this.points[nextIndex]

            ctx.lineTo(nextPoint.x, nextPoint.y)
        }
        
        ctx.closePath()
        ctx.fill()
        
        if (this.#strokeColor !== null)
            ctx.stroke()
    }
}