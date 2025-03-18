import GameplayScene from "./GameplayScene.js"
import Mouse from "./Mouse.js"
import Keyboard from "./Keyboard.js"
import DeltaTime from "./DeltaTime.js"

export default class Game {
    constructor() {
        onkeydown = e => this.onkeydown(e)
        onkeyup = e => this.onkeyup(e)
        onmousemove = e => this.onmousemove(e)
        onmousedown = e => this.onmousedown(e)
        onmouseup = e => this.onmouseup(e)

        this.scenes.push(new GameplayScene(this))
        requestAnimationFrame(() => this.animate())
    }

    scenes = []
    
    rect = null
    showHitboxes = false
    
    dt = new DeltaTime(this)
    mouse = new Mouse(this)
    keyboard = new Keyboard(this)

    onmousemove(e) {
        this.mouse.onmousemove(e)
    }

    onmousedown(e) {
        this.mouse.onmousedown(e)
    }

    onmouseup(e) {
        this.mouse.onmouseup(e)
    }

    onkeydown(e) {
        this.keyboard.onkeydown(e)
    }

    onkeyup(e) {
        this.keyboard.onkeyup(e)
    }

    drawScenes() {
        for (const scene of this.scenes)
            scene.draw()
    }

    forScenes(func, sceneType = null) {
        for (const scene of this.scenes) {
            if (sceneType != null && !scene instanceof sceneType) continue

            func(scene)
        }
    }

    animate() {
        this.dt.updateDeltaTime()
        this.drawScenes()
        requestAnimationFrame(() => this.animate())
    }
}