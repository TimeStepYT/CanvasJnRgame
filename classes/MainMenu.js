import Scene from "./Scene.js"

export default class MainMenu extends Scene {
	onPlay() {
		this.initLevels()
        this.createPlayer()
	}
	draw() {
		console.log("Hi")
	}
}