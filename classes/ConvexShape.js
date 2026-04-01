import Point from "./Point.js"
import Rect from "./Rect.js"

export default class ConvexShape {
    points = []

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

    collidesWith(otherShape) {
        // Placeholder
        return false
    }
}