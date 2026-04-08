import ConvexShape from "./ConvexShape.js"
import Point from "./Point.js"
import Triangle from "./Triangle.js"

export default class ConcaveShape extends ConvexShape {
    points = []
    #convexShapes = []
    #lastShapeDirection = 0

    static create(points) {
        let ret = new ConcaveShape()
        ret.addPoints(points)

        return ret
    }
    
    static createFromRect(rect) {
        let ret = new ConcaveShape()
        ret.addPoints([
            Point(rect.x, rect.y),
            Point(rect.x + rect.w, rect.y),
            Point(rect.x + rect.w, rect.y + rect.h),
            Point(rect.x, rect.y + rect.h)
        ])
        return ret
    }

    #assertConvexShapes() {
        if (this.#convexShapes.length !== 0)
            return

        console.warn("This shape hasn't been triangulated yet! Triangulating now. (THIS WILL ONLY WORK ONCE)")
        console.warn(this)
        this.updateConvexShapes()
    }

    #collidesWithConvexShape(shape) {
        if (shape.points.length < 3)
            return false

        for (const convexShape of this.#convexShapes) {
            if (shape.collidesWith(convexShape))
                return true
        }
        return false
    }

    #collidesWithConcaveShape(shape) {
        if (shape.points.length < 3)
            return false

        shape.#assertConvexShapes()

        for (const thisConvexShape of this.#convexShapes) {
            for (const otherConvexShape of shape.#convexShapes) {
                if (thisConvexShape.collidesWith(otherConvexShape))
                    return true
            }
        }
        return false
    }

    collidesWith(shape) {
        if (this.points.length < 3)
            return false

        this.#assertConvexShapes()

        if (shape instanceof ConvexShape) {
            return this.#collidesWithConvexShape(shape)
        }
        if (shape instanceof ConcaveShape) {
            return this.#collidesWithConcaveShape(shape)
        }
    }

    updateConvexShapes() {
        if (this.points.length < 3)
            return false

        let convexShapes = []
        let points = [...this.points]
        let res = true
        
        const windingDirection = this.getWindingDirection()

        while (points.length != 3) {
            let success = false

            for (let i = 0; i < points.length; i++) {
                const prevPoint = points[(i - 1 + points.length) % points.length]
                const point = points[i]
                const nextPoint = points[(i + 1) % points.length]

                const triangle = new Triangle(prevPoint, point, nextPoint)

                if (triangle.getWindingDirection() != windingDirection)
                    continue

                let triangleContainsPoint = false
                for (let point2 of points) {
                    if (point2 == prevPoint || point2 == point || point2 == nextPoint)
                        continue

                    if (triangle.containsPoint(point2)) {
                        triangleContainsPoint = true
                        break
                    }
                }

                if (triangleContainsPoint)
                    continue

                convexShapes.push(ConvexShape.create([prevPoint, point, nextPoint]))
                points.splice(i, 1)
                success = true
                break
            }

            if (!success) {
                res = false
                break
            }
        }

        convexShapes.push(ConvexShape.create(points))

        this.#convexShapes = convexShapes
        return res
    }

    draw() {
        super.draw()
        // for (let shape of this.#convexShapes) {
        //     shape.setColor("white").setStrokeColor("black").draw()
        // }
    }
}