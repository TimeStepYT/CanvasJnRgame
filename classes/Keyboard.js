import Game from "./Game.js"
import GameplayLayer from "./GameplayLayer.js"

export default class Keyboard {
    constructor(game) {
        this.game = game
    }

    game = null

    keysDown = {}

    onkeydown(e) {
        let key = e.key.toLowerCase()
        this.keysDown[key] = true

        this.game.forLayers(layer => {
            if (layer.players != null)
                for (const player of layer.players)
                    player.onkeydown(key)
        }, GameplayLayer)

        switch (key) {
            case "r":
                this.game.forLayers(layer => {
                    if (!layer.level.platforms[layer.level.platforms.length - 1].isMainLevel || this.game.editMode)
                        layer.level.platforms.pop()

                }, GameplayLayer)

                break
            case "p":
                this.game.forLayers(layer => {
                    layer.createPlayer()
                }, GameplayLayer)
                break
            default:
            // console.log(e.key)
        }
    }
    onkeyup(e) {
        let key = e.key.toLowerCase()
        this.keysDown[key] = false
        this.game.forLayers(layer => {
            layer.players.forEach(p => p.onkeyup(key))
        }, GameplayLayer)
    }
}