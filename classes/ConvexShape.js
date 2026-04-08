import Point from "./Point.js"
import Triangle from "./Triangle.js"
import Utils from "./Utils.js"
import {ctx} from "../script.js"

export default class ConvexShape extends Triangle {
    points = []
    #color = "black"
    #strokeColor = null

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

    #collisionPart(points, otherShape) {
        for (let i = 0; i < points.length; i++) {
            const point = points[i]
            const nextPoint = points[(i + 1) % points.length]
            const edge = point.getEdge(nextPoint)
            const normal = new Point(-edge.y, edge.x)

            const axisLength = Math.sqrt(normal.x ** 2 + normal.y ** 2)

            let projectedA = []
            let projectedB = []

            for (let vertex of this.points) {
                projectedA.push(normal.dotProduct(vertex) / axisLength)
            }
            for (let vertex of otherShape.points) {
                projectedB.push(normal.dotProduct(vertex) / axisLength)
            }


            const minA = Math.min(...projectedA)
            const minB = Math.min(...projectedB)
            const maxA = Math.max(...projectedA)
            const maxB = Math.max(...projectedB)

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
        const thisShapeSA = this.#collisionPart(this.points, otherShape)
        if (!thisShapeSA)
            return false
        
        const otherShapeSA = this.#collisionPart(otherShape.points, otherShape)
        if (!otherShapeSA)
            return false


        return true
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