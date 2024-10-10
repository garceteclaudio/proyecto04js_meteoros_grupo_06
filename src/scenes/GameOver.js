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
      .text(400, 250, `¡Has muerto! Juego Terminado.`, {
        fontSize: "30px",
        fill: "#fff",
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0.5);

    this.add
      .text(400, 300, `Puntaje: ${this.puntaje}`, {
        fontSize: "30px",
        fill: "#fff",
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0.5);

    this.add
      .text(400, 350, "Presiona R para volver a jugar.", {
        fontSize: "20px",
        fill: "#fff",
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0.5);

    // Añadir un listener para la tecla R
    this.input.keyboard.on("keydown-R", () => {
      this.scene.start("Escena 1"); // Reiniciar el juego desde "Escena 1"
    });
  }
}
