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
        if (this.dt > 2) this.dt = 2 // Don't explode when tabbing out
        console.log(this.dt);
        this.lastUpdated = this.now
    }
}