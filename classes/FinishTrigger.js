import Trigger from "./Trigger.js"

export default class FinishTrigger extends Trigger {
    create(x, y, w, h) {
        super.create(x, y, w, h, (game) => {
            game.switchLevel(game.levelNumber + 1)
        })
        return this
    }
}