import Game from "./Game.js"
import GameplayScene from "./GameplayScene.js"

export default class Keyboard {
    constructor(game) {
        this.game = game
    }

    game = null

    keysDown = {}

    onkeydown(e) {
        let key = e.key.toLowerCase()
        this.keysDown[key] = true

        this.game.forScenes(scene => {
            if (scene.players != null)
                for (const player of scene.players)
                    player.onkeydown(key)
        }, GameplayScene)

        switch (key) {
            case "r":
                for (const scene of this.game.scenes) {
                    if (!scene instanceof GameplayScene) continue

                    if (!scene.level.platforms[scene.level.platforms.length - 1].isMainLevel || this.game.editMode)
                        scene.level.platforms.pop()
                }
                break
            case "p":
                for (const scene of this.game.scenes) {
                    if (!scene instanceof GameplayScene) continue

                    scene.createPlayer()
                }
                break
            default:
            // console.log(e.key)
        }
    }
    onkeyup(e) {
        let key = e.key.toLowerCase()
        this.keysDown[key] = false

        for (const scene of this.game.scenes) {
            if (!scene instanceof GameplayScene) continue

            scene.players.forEach(p => p.onkeyup(key))
        }
    }
}