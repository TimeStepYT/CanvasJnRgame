import Utils from "./Utils.js"

export default class Triangle {
    points = new Array(3)

    constructor(A, B, C) {
        this.points[0] = A
        this.points[1] = B
        this.points[2] = C
    }
    
    getWindingDirection() {
        const A = this.points[0]
        const B = this.points[1]
        const C = this.points[2]

        const ab = A.getEdge(B)
        const bc = B.getEdge(C)

        const cross = ab.x * bc.y - ab.y * bc.x

        if (cross > 0)
            return 1
        
        return -1
    }

    containsPoint(point) {
        const A = this.points[0]
        const B = this.points[1]
        const C = this.points[2]

        const ab = A.getEdge(B)
        const bc = B.getEdge(C)
        const ca = C.getEdge(A)

        const ap = A.getEdge(point)
        const bp = B.getEdge(point)
        const cp = C.getEdge(point)
        
        const windingDirection = this.getWindingDirection()
        
        const cross1 = Utils.getCrossProduct(ab, ap) * windingDirection
        const cross2 = Utils.getCrossProduct(bc, bp) * windingDirection
        const cross3 = Utils.getCrossProduct(ca, cp) * windingDirection

        if (cross1 <= 0 || cross2 <= 0 || cross3 <= 0)
            return false
        
        return true
    }
}