import {ctx} from "../script.js"
import Rect from "./Rect.js"

export default class ImageHandler extends Rect {
    image = null
    flippedX = false
    flippedY = false
    
    static imageMap = {}
    
    constructor() {
        super()
    }
    
    get() {
        return this.image
    }

    static registerImage(name, path) {
        let newImage = new Image()
        newImage.src = path

        ImageHandler.imageMap[name] = {
            "image": newImage,
            "loaded": false
        }
        
        newImage.onload = () => {
            ImageHandler.imageMap[name].loaded = true;
        }
    }

    static create(spriteName) {
        const handler = new ImageHandler()
        handler.setImage(spriteName)
        return handler
    }

    setImage(spriteName) {
        this.image = ImageHandler.imageMap[spriteName].image

        if (this.image === undefined)
            console.error("Sprite \"" + spriteName + "\" is not loaded!");

        this.init()
    }

    setFlippedX(flipped) {
        this.flippedX = flipped
    }

    setFlippedY(flipped) {
        this.flippedY = flipped
    }

    init() {
        this.w = this.image.width
        this.h = this.image.height
    }

    draw(x = 0, y = 0, w = this.w, h = this.h) {
        ctx.drawImage(this.get(), x, y, w, h)
    }
}