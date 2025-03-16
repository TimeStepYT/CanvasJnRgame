export default class Level {
    platforms = []
    origin = null

    create(platforms, origin) {
        this.platforms = platforms
        this.origin = origin

        return this
    }
}