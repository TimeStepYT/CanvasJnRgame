import Point from "./Point.js"
import { ctx } from "../script.js"

export default class Text {
	pos = null
	size = null
	font = "Comic Sans MS"
	alignX = "start"
	alignY = "alphabetic"
	color = "black"
	weight = ""
	string = null

	offsetPos = new Point(0, 0)

	static create(string, point, size = 10) {
		let res = new Text()
		res.string = string
		res.pos = point
		res.size = size
		return res
	}

	setSize(size) {
		this.size = size
		return this
	}

	setFont(font) {
		this.font = font
		return this
	}

	setAlignX(alignX) {
		this.alignX = alignX
		return this
	}

	setAlignY(alignY) {
		this.alignY = alignY
		return this
	}

	setColor(color) {
		this.color = color
		return this
	}
	
	draw() {
		ctx.fillStyle = this.color
		ctx.textAlign = this.alignX
		ctx.textBaseline = this.alignY
		ctx.font = this.weight + " " + this.size + "px " + this.font
		
		ctx.fillText(this.string, this.pos.x + this.offsetPos.x, this.pos.y + this.offsetPos.y)
		return this
	}
}