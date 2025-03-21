import Point from "./Point.js"
import {ctx} from "../script.js"

export default class Rect {
    x = null
    y = null
    w = null
    h = null
    color = "black"

    offsetPos = new Point(0, 0)

    hasNaN() {
        if (isNaN(this.x) || isNaN(this.y) || isNaN(this.w) || isNaN(this.h)) {
            console.log(this)
            console.error("NaN detected")
            return true
        }
        return false
    }
    create(x, y, w, h) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h

        this.hasNaN()
        return this
    }

    fromObject(obj) {
        this.x = obj.x
        this.y = obj.y
        this.w = obj.w
        this.h = obj.h

        this.hasNaN()
        return this
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
}