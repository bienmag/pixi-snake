import * as PIXI from 'pixi.js'
import footballer from './assets/soccer-dribbling.png'
import ball from './assets/soccer-ball-variant.png'
import field from './assets/field.png'

const app = new PIXI.Application({
  width: 800,
  height: 600,
  backgroundColor: 0x00ff00,
})
const fieldTexture = PIXI.Texture.from(field)
const fieldSprite = new PIXI.Sprite(fieldTexture)
fieldSprite.width = app.screen.width
fieldSprite.height = app.screen.height
app.stage.addChild(fieldSprite)

document.body.appendChild(app.view)

class Collectible extends PIXI.Sprite {
  constructor() {
    const football = PIXI.Texture.from(ball)
    super(football)
    this.anchor.set(0.5)
    this.x = Math.random() * app.screen.width
    this.y = Math.random() * app.screen.height
    this.scale.set(0.06)
    app.stage.addChild(this)
  }
}
function spawnCollectible() {
  if (
    app.stage.children.filter((item) => item instanceof Collectible).length ===
    0
  )
    new Collectible()
}
setInterval(spawnCollectible, 0)

let direction = ''

function startMoving(e) {
  direction = e
}

window.addEventListener('keydown', (e) => {
  if (
    e.key === 'ArrowUp' ||
    e.key === 'ArrowDown' ||
    e.key === 'ArrowLeft' ||
    e.key === 'ArrowRight'
  ) {
    startMoving(e.key)
  }
})

const players = []
const initialPlayer = PIXI.Sprite.from(footballer)
initialPlayer.scale.set(0.08)
initialPlayer.anchor.set(0.5)
initialPlayer.x = app.screen.width / 2
initialPlayer.y = app.screen.height / 2
players.push(initialPlayer)
app.stage.addChild(initialPlayer)

const playerSpeed = 3
let playerVelocity = new PIXI.Point(0, 0)

function animate() {
  for (let i = players.length - 1; i > 0; i--) {
    players[i].x = players[i - 1].x
    players[i].y = players[i - 1].y
  }

  if (direction === 'ArrowUp') {
    players[0].y -= playerSpeed
  } else if (direction === 'ArrowDown') {
    players[0].y += playerSpeed
  } else if (direction === 'ArrowLeft') {
    players[0].x -= playerSpeed

    players.forEach((player) => (player.scale.x = -0.08))
  } else if (direction === 'ArrowRight') {
    players[0].x += playerSpeed
    players.forEach((player) => (player.scale.x = 0.08))
  }

  initialPlayer.x += playerVelocity.x
  initialPlayer.y += playerVelocity.y

  if (initialPlayer.x < 0) {
    initialPlayer.x = 800
  }
  if (initialPlayer.x > app.screen.width) {
    initialPlayer.x = 0
  }
  if (initialPlayer.y < 0) {
    initialPlayer.y = 600
  }
  if (initialPlayer.y > app.screen.height) {
    initialPlayer.y = 0
  }

  for (const collectible of app.stage.children) {
    if (collectible instanceof Collectible) {
      if (
        initialPlayer.x + initialPlayer.width / 2 >
          collectible.x - collectible.width / 2 &&
        initialPlayer.x - initialPlayer.width / 2 <
          collectible.x + collectible.width / 2 &&
        initialPlayer.y + initialPlayer.height / 2 >
          collectible.y - collectible.height / 2 &&
        initialPlayer.y - initialPlayer.height / 2 <
          collectible.y + collectible.height / 2
      ) {
        app.stage.removeChild(collectible)
        const newPlayer = PIXI.Sprite.from(footballer)
        newPlayer.scale.set(0.08)
        newPlayer.anchor.set(0.5)
        newPlayer.x = players[players.length - 1].x
        newPlayer.y = players[players.length - 1].y
        players.push(newPlayer)
        app.stage.addChild(newPlayer)
      }
    }
  }

  requestAnimationFrame(animate)
}

animate()
