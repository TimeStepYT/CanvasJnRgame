import Size from "./Size.js"
import MainMenuLayer from "./MainMenuLayer.js"
import Mouse from "./Mouse.js"
import Keyboard from "./Keyboard.js"
import DeltaTime from "./DeltaTime.js"
import { canvas } from "../script.js"

export default class Game {
    constructor() {
        onkeydown = e => this.onkeydown(e)
        onkeyup = e => this.onkeyup(e)

        if (typeof ontouchstart != "undefined") {
            ontouchstart = e => this.onmousedown(e)
            ontouchend = e => this.onmouseup(e)
            ontouchmove = e => this.onmousemove(e)
            ontouchcancel = e => this.onmouseup(e)
        }
        else {
            onmousemove = e => this.onmousemove(e)
            onmousedown = e => this.onmousedown(e)
            onmouseup = e => this.onmouseup(e)
        }

        this.layers.push(new MainMenuLayer(this))
        requestAnimationFrame(() => this.animate())
    }

    layers = []

    rect = null
    windowSize = new Size(canvas.width, canvas.height)
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

    drawLayers() {
        this.forLayers(layer => {
            layer.draw()
            for (const button of layer.buttons) {
                button.draw()
            }
        })
    }

    forLayers(func, layerType = null) {
        for (const layer of this.layers) {
            if (layerType != null && !(layer instanceof layerType)) continue

            func(layer)
        }
    }

    animate() {
        this.dt.updateDeltaTime()
        this.drawLayers()
        requestAnimationFrame(() => this.animate())
    }
}