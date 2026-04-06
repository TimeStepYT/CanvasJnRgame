import ConvexShape from "./ConvexShape.js"
import Point from "./Point.js"

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

    collidesWith(shape) {
        if (this.#convexShapes.length === 0) {
            console.warn("This shape hasn't been triangulated yet! Triangulating now. (THIS WILL ONLY WORK ONCE)")
            console.warn(this)
            this.updateConvexShapes()
        }

        if (shape instanceof ConvexShape) {
            for (const convexShape of this.#convexShapes) {
                if (shape.collidesWith(convexShape))
                    return true
            }
            return false
        }
        if (shape instanceof ConcaveShape) {
            for (const thisConvexShape of this.#convexShapes) {
                for (const otherConvexShape of shape.#convexShapes) {
                    if (thisConvexShape.collidesWith(otherConvexShape))
                        return true
                }
            }
            return false
        }
    }

    updateConvexShapes() {
        //TODO: ts pmo
    }

    draw() {
        super.draw()
        for (let shape of this.#convexShapes) {
            shape.setColor("white").setStrokeColor("black").draw()
        }
    }
}