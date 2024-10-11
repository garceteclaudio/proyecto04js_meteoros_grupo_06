import Escena1 from "./scenes/Escena1.js";
import GameOver from "./scenes/GameOver.js";
import Bonustrack from "./scenes/BonusTrack.js";

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
  scene: [Escena1, Bonustrack, GameOver],
  parent: "game-container",
};

let game = new Phaser.Game(config);
