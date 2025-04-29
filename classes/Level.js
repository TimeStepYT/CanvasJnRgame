export default class Level {
    platforms = []
    origin = null
    checks = []

    willExit = false

    static create(platforms, origin, checks = []) {
        let res = new Level()
        res.platforms = platforms
        res.origin = origin
        res.checks = checks

        return res
    }

    static fromObject(obj) {
        let res = new Level()
        res.platforms = [...obj.platforms]
        res.origin = obj.origin
        res.checks = [...obj.checks]

        return res
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