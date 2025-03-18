import Trigger from "./Trigger.js"

export default class FinishTrigger extends Trigger {
    create(x, y, w, h) {
        super.create(x, y, w, h, (scene) => {
            scene.switchLevel(scene.levelNumber + 1)
        })
        return this
    }
}