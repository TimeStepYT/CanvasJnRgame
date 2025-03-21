import Point from "./Point.js"
import { canvas } from "../script.js"

export default class Mouse {
    constructor(game) {
        this.game = game
    }

    game = null

    clicking = false
    pos = null

    checkForButtons(layer) {
        if (layer.buttons.length == 0)
            canvas.style = "cursor: normal;"
        else for (const button of layer.buttons) {
            if (button.isColliding(this.pos.getRect())) {
                button.mouseOver()
                break
            }
            else
                canvas.style = "cursor: normal;"
        }
    }

    onmousemove(e) {
        this.game.rect = canvas.getBoundingClientRect()
        let rect = this.game.rect

        // Mobile touches :)
        if (e.touches != null) {
            e.clientX = e.touches[0].clientX
            e.clientY = e.touches[0].clientY
        }

        const xPos = (e.clientX - rect.left) * (canvas.width / (rect.width - 6)) - 2
        const yPos = (e.clientY - rect.top) * (canvas.height / (rect.height - 6)) - 2

        this.pos = new Point(xPos, yPos)

        this.game.forLayers(layer => {
            layer.onmousemove(e)
            this.checkForButtons(layer)
        })
    }

    onmousedown(e) {
        if (this.pos == null || e.touches != null)
            this.onmousemove(e)

        if (e.button == 0 || e.touches != null) this.clicking = true

        this.game.forLayers(layer => {
            for (const button of layer.buttons) {
                if (button.isColliding(this.pos.getRect())) {
                    button.onClick()
                    break
                }
            }
            layer.onmousedown(e)

            if (layer.willExit)
                canvas.style = ""
        })

    }

    onmouseup(e) {
        if (e.button == 0 || e.touches != null)
            this.clicking = false

        this.game.forLayers(layer => {
            layer.onmouseup(e)
        })
    }


}