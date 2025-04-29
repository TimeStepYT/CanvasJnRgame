import Point from "./Point.js"
import {ctx} from "../script.js"

export default class Rect {
    x = null
    y = null
    w = null
    h = null
    color = "black"

    offsetPos = new Point(0, 0)

    constructor() {

    }

    hasNaN() {
        if (isNaN(this.x) || isNaN(this.y) || isNaN(this.w) || isNaN(this.h)) {
            console.log(this)
            console.error("NaN detected")
            return true
        }
        return false
    }
    static create(x, y, w, h) {
        let res = new Rect()
        res.x = x
        res.y = y
        res.w = w
        res.h = h

        res.hasNaN()
        return res
    }

    static fromObject(obj) {
        let res = new Rect()
        res.x = obj.x
        res.y = obj.y
        res.w = obj.w
        res.h = obj.h

        res.hasNaN()
        return res
    }

    isColliding(rect) {
        if (rect == null) {
            console.error("The rect to be checked with is not declared")
            return false
        }
        if (this.x == null && this.y == null && this.w == null && this.h == null) {
            console.error("This rect is not defined")
            return false
        }
        return (
            this.y + this.h > rect.y &&
            this.y < rect.y + rect.h &&
            this.x < rect.x + rect.w &&
            this.x + this.w > rect.x
        );
    }
    isCollidingY(rect) {
        if (rect == null) {
            console.error("The rect to be checked with is not declared")
            return false
        }
        if (this.y == null && this.h == null) {
            console.error("This rect is not defined")
            return false
        }
        return (
            this.y + this.h > rect.y &&
            this.y < rect.y + rect.h
        );
    }

    draw() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x + this.offsetPos.x, this.y + this.offsetPos.y, this.w, this.h)
        return this
    }

    drawOutline() {
        ctx.strokeStyle = this.color
        ctx.strokeRect(this.x + this.offsetPos.x, this.y + this.offsetPos.y, this.w, this.h)
        return this
    }

    setColor(color) {
        this.color = color
        return this
    }

    setPosition(point) {
        this.x = point.x
        this.y = point.y

        return this
    }
}