import Trigger from "./Trigger.js"

export default class FinishTrigger extends Trigger {
    create(x, y, w, h) {
        super.create(x, y, w, h, (player) => {
            const hitChecks = player.hitChecks.length
            const checks = player.layer.level.checks.length

            if (hitChecks == checks)
                player.layer.switchLevel(player.layer.levelNumber + 1)
        })
        return this
    }
}