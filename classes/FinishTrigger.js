import Trigger from "./Trigger.js"

export default class FinishTrigger extends Trigger {
    create(x, y, w, h) {
        super.create(x, y, w, h, (player) => {
            player.scene.switchLevel(player.scene.levelNumber + 1)
        })
        return this
    }
}