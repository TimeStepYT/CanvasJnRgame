import Rect from "./Rect.js"
import Trigger from "./Trigger.js"

export default class Entity extends Rect {
	constructor(layer) {
		super()

		this.game = layer.game
		this.layer = layer
	}

	layer = null
	game = null
	health = 10
	dead = false
	xv = 0
	yv = 0
	w = 10
	h = 10
	terminalVelocity = 20
	gravity = 0.8
	speedFactor = 1
	maxSpeed = 10
	floorPlatform = null
	prevEnt = null

	standAction(touchingTop) { }

	collidingAction(platform) {
		return false
	}

	handleCollision(platform, dt) {
		const xOffset = this.xv * dt
		const yOffset = this.yv * dt

		const futureX = this.x + xOffset
		const futureY = this.y + yOffset

		const futureEntityRect = Rect.create(futureX, futureY, this.w, this.h)

		if (!futureEntityRect.isColliding(platform)) return false

		if (this.collidingAction(platform) || !platform.solid) return false
		
		const dx = ((futureX + this.w) - (platform.x + platform.w)) / 2 // center of player - center of platform
		const dy = ((futureY + this.h) - (platform.y + platform.h)) / 2 // center of player - center of platform

		const futureEntityRectY = Rect.create(this.x, futureY, this.w, this.h)
		const futureEntityRectX = Rect.create(futureX, this.y, this.w, this.h)

		let res = false

		if (futureEntityRectY.isColliding(platform)) {
			if (dy < 0 && this.prevEnt.y + this.prevEnt.h <= platform.y) {
				this.y = platform.y - this.h
				this.yv = 0
				this.standAction(true)

				if (this.gravity > 0)
					this.floorPlatform = platform

				res = true
			} else if (dy > 0 && this.prevEnt.y >= platform.y + platform.h) {
				this.y = platform.y + platform.h
				this.yv = 0
				this.standAction(false)

				if (this.gravity < 0)
					this.floorPlatform = platform
				res = true
			}
		}
		if (futureEntityRectX.isColliding(platform)) {
			if (dx < 0 && this.prevEnt.x <= platform.x - this.prevEnt.w) {
				this.x = platform.x - this.w
				this.xv = 0
				res = true
			} else if (dx > 0 && this.prevEnt.x >= platform.x + platform.w) {
				this.x = platform.x + platform.w
				this.xv = 0
				res = true
			}
		}
		return res
	}

	checkCollision(list) {
		const dt = this.game.dt.get()
		
		let steps = 1
		
		const absXV = Math.abs(this.xv)
		const absYV = Math.abs(this.yv)

		if (absXV > absYV)
			steps = (absXV * dt) / this.w
		else
			steps = (absYV * dt) / this.h
		
		// const steps = 4 // Mario 64 style splitting up the positions every frame for more accuracy
		
		for (const element of list) {
			for (let i = 0; i < steps; i++) {
				if (this.handleCollision(element, dt * (i / steps)))
					break
			}
		}
	}

	handleFriction(dt) {
		if (this.floorPlatform == null) return

		if (this.floorPlatform.friction == null) {
			console.error("The platform a " + this.constructor.name + " is standing on has an undefined friction value!")
			return
		}

		if (this.xv > 0) {
			this.xv -= this.floorPlatform.friction * dt
			if (this.xv < 0)
				this.xv = 0
		}
		else if (this.xv < 0) {
			this.xv += this.floorPlatform.friction * dt
			if (this.xv > 0)
				this.xv = 0
		}
	}

	getEntityObject() {
		return {
			x: this.x,
			y: this.y,
			w: this.w,
			h: this.h,
			xv: this.xv,
			yv: this.yv
		}
	}

	draw() { }
}