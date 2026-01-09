import {ctx} from "../script.js"
import Rect from "./Rect.js"

export default class ImageHandler extends Rect {
    image = null
    loaded = false
    flippedX = false
    flippedY = false
    
    constructor() {
        super()
    }
    
    onLoad() {}

    get() {
        return this.image
    }

    static createWithImage(img) {
        const handler = new ImageHandler()
        handler.setImage(img)
        return handler
    }

    static createWithString(img) {
        let newImage = new Image()
        newImage.src = img
        const handler = new ImageHandler()
        handler.setImage(newImage)
        return handler
    }

    setImage(img) {
        this.loaded = false
        this.image = img
        this.init()
    }

    setFlippedX(flipped) {
        this.flippedX = flipped
    }

    setFlippedY(flipped) {
        this.flippedY = flipped
    }

    init() {
        this.image.onload = () => {
            this.loaded = true
            this.w = this.image.width
            this.h = this.image.height
            this.onLoad()
        }
    }

    isLoaded() {
        return this.loaded
    }

    draw(x = 0, y = 0, w = this.w, h = this.h) {
        if (!this.isLoaded())
            return
        ctx.drawImage(this.get(), x, y, w, h)
    }
}