export default class Level {
    platforms = []
    origin = null

    willExit = false

    create(platforms, origin) {
        this.platforms = platforms
        this.origin = origin

        return this
    }

    fromObject(obj) {
        this.platforms = [...obj.platforms]
        this.origin = obj.origin

        return this
    }
}