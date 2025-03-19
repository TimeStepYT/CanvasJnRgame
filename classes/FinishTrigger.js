import Trigger from "./Trigger.js"

export default class FinishTrigger extends Trigger {
    create(x, y, w, h) {
        super.create(x, y, w, h, (player) => {
            player.layer.switchLevel(player.layer.levelNumber + 1)
        })
        return this
    }
}