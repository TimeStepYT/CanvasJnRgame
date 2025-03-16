import Game from "./classes/Game.js"

export var canvas = document.getElementById("gameCanvas")
export var ctx = canvas.getContext("2d")

window.game = new Game()
// game.showHitboxes = true