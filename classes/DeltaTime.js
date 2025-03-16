export default class DeltaTime {
    constructor(game) {
        this.game = game
    }

    game = null

    now = 0
    dt = 2.4
    lastUpdated = 0

    get() {
        return this.dt
    }

    updateDeltaTime() {
        this.now = performance.now()
        this.dt = ((this.now - this.lastUpdated) / 10) * 0.6
        if (this.dt > 4) this.dt = 4 // Don't explode when tabbing out
        // this.dt = 0.2
        this.lastUpdated = this.now
    }
}