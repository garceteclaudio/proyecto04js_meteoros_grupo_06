import Escena1 from "./scenes/Escena1.js";

let config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [Escena1],
  parent: "game-container",
};

let game = new Phaser.Game(config);
