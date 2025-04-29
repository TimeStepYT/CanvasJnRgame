import Rect from "./Rect.js"

export default class Size {
	constructor(w, h) {
		this.w = w
		this.h = h
	}

	getRect() {
		return Rect.create(0, 0, this.w, this.h)
	}

	w = null
	h = null
}