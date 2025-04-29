import Trigger from "./Trigger.js"

export default class FinishTrigger extends Trigger {
    static create(x, y, w, h) {
        let res = new FinishTrigger()
        res.x = x
        res.y = y
        res.w = w
        res.h = h
        
        res.func = (player) => {
            const hitChecks = player.hitChecks.length
            const checks = player.layer.level.checks.length

            if (hitChecks == checks)
                player.layer.switchLevel(player.layer.levelNumber + 1)
        }

        return res
    }
}