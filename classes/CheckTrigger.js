import Trigger from "./Trigger.js"

export default class CheckTrigger extends Trigger {
    color = "#00ff00a0"

    create(x, y, w, h) {
        super.create(x, y, w, h, (player) => {
            if (player.hitChecks.includes(this)) return

            player.hitChecks.push(this)

            console.log("check hit!")
        })

        return this
    }
}