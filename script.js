import Game from "./Game.js"

export var canvas = document.getElementById("gameCanvas")
export var ctx = canvas.getContext("2d")

var game = new Game()
// game.showHitboxes = true