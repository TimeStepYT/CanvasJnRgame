

export default class Keyboard {
    constructor(game) {
        this.game = game
    }

    game = null
    keysDown = {}

    onkeydown(e) {
        let key = e.key.toLowerCase()
        this.keysDown[key] = true
        
        for (const player of this.game.players)
            player.onkeydown(key)
        
        switch (key) {
            case "r":
                if (!this.game.level.platforms[this.game.level.platforms.length - 1].isMainLevel || this.game.editMode)
                    this.game.level.platforms.pop()
                break
            case "p":
                this.game.createPlayer()
                break
            default:
            // console.log(e.key)
        }
    }
    onkeyup(e) {
        let key = e.key.toLowerCase()
        this.keysDown[key] = false
        this.game.players.forEach(p => p.onkeyup(key))
    }
}