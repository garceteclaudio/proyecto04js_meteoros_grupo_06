export default class GameOver extends Phaser.Scene {
  constructor() {
    super({ key: "GameOver" });
  }

  preload() {
    this.load.image(
      "fondoGameOver",
      "/public/resources/images/fondoGameOver.png"
    );
  }

  init(data) {
    this.puntaje = data.puntaje || 0;
  }

  create() {
    this.add.image(400, 300, "fondoGameOver").setOrigin(0.5);

    this.add
      .text(400, 300, `¡Has muerto! Juego Terminado.`, {
        fontSize: "30px",
        fill: "#fff",
        fontStyle: "bold",
        aling: "center",
      })
      .setOrigin(0.5);

    this.add
      .text(400, 350, `Puntaje: ${this.puntaje}`, {
        fontSize: "30px",
        fill: "#fff",
        fontStyle: "bold",
        aling: "center",
      })
      .setOrigin(0.5);

    this.add
      .text(400, 400, "Presiona R para empezar de nuevo", {
        fontSize: "20px",
        fill: "#fff",
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0.5);

    this.restartKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.R
    );
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.restartKey)) {
      this.scene.start("Escena 2");
    }
  }
}
