import Trigger from "./Trigger.js"

export default class CheckTrigger extends Trigger {
    color = "#00ff00a0"

    static create(x, y, w, h) {
        let res = new CheckTrigger()

        res.x = x
        res.y = y
        res.w = w
        res.h = h
        
        res.func = (player) => {
            if (player.hitChecks.includes(res)) return

            player.hitChecks.push(res)
        }

        return res
    }
}