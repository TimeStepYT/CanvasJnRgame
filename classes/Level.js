export default class Level {
    platforms = []
    origin = null
    checks = []

    willExit = false

    create(platforms, origin, checks = []) {
        this.platforms = platforms
        this.origin = origin
        this.checks = checks

        return this
    }

    fromObject(obj) {
        this.platforms = [...obj.platforms]
        this.origin = obj.origin
        this.checks = [...obj.checks]

        return this
    }

    getCopyable() {
        let res = []
        for (const platform of this.platforms) {
            const obj = {
                x: platform.x,
                y: platform.y,
                w: platform.w,
                h: platform.h
            }
            res.push(obj)
        }
        return res
    }
}