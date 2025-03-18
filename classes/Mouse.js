import Rect from "./Rect.js"
import Point from "./Point.js"
import Platform from "./Platform.js"
import GameplayLayer from "./GameplayLayer.js"
import { canvas } from "../script.js"

export default class Mouse {
    constructor(game) {
        this.game = game
    }

    game = null

    clicking = false

    pos = null

    onmousemove(e) {
        this.game.rect = canvas.getBoundingClientRect()
        let rect = this.game.rect
        const xPos = e.clientX - rect.left - 2
        const yPos = e.clientY - rect.top - 2

        this.pos = new Point().create(xPos, yPos)

        this.game.forLayers(layer => {
            layer.onmousemove(e)
        })
    }
    onmousedown(e) {
        switch (e.button) {
            case 0:
                this.clicking = true
                break
        }
        this.game.forLayers(layer => {
            layer.onmousedown(e)
        })
    }
    onmouseup(e) {
        switch (e.button) {
            case 0:
                this.clicking = false
                break
        }
        this.game.forLayers(layer => {
            layer.onmouseup(e)
        })
    }


}