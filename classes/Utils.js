export default class Utils {
    static getCrossProduct(vec1, vec2) {
        return vec1.x * vec2.y - vec1.y * vec2.x
    }

    static getCrossDirection(A, B, C) {
        const ab = A.getEdge(B)
        const bc = B.getEdge(C)

        const cross = this.getCrossProduct(ab, bc)

        if (cross > 0)
            return 1
        else if (cross < 0)
            return -1
        return 0
    }
}