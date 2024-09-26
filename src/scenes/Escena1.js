export default class Escena1 extends Phaser.Scene {
  constructor() {
    super("Escena 1");
    this.jugador = null;
    this.grupoMeteoros = null;
    this.cursors = null;
    this.teclas = null; // propiedad para las teclas WASD
    this.puntaje = 0;
    this.textoDePuntaje = null; // Cambiado a null
  }

  preload() {
    this.load.image("cielo", "/public/resources/images/cielo.png");
    this.load.image("nave", "/public/resources/images/nave.png");
    this.load.image("meteoro", "/public/resources/images/meteoro.png");
  }

  create() {
    this.add.image(400, 300, "cielo");
    this.jugador = this.physics.add.sprite(400, 550, "nave");
    this.jugador.setCollideWorldBounds(true); // evita que salga de la pantalla

    this.grupoMeteoros = this.physics.add.group(); // creando el grupo de meteoritos

    this.time.addEvent({
      delay: 1000,
      callback: this.generarMeteoros,
      callbackScope: this,
      loop: true,
    });

    // Evento para incrementar el puntaje cada segundo
    this.time.addEvent({
      delay: 1000,
      callback: this.incrementarPuntaje,
      callbackScope: this,
      loop: true,
    });

    // Crear las teclas de flechas
    this.cursors = this.input.keyboard.createCursorKeys();

    // Crear teclas WASD
    this.teclas = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    this.physics.add.collider(
      this.jugador,
      this.grupoMeteoros,
      this.gameOver,
      null,
      this
    );

    this.textoDePuntaje = this.add.text(16, 16, "Puntaje: 0", {
      fontSize: "32px",
      fill: "#fff",
    });
  }

  generarMeteoros() {
    const x = Phaser.Math.Between(0, 800);
    const meteoro = this.grupoMeteoros.create(x, 0, "meteoro");

    meteoro.setVelocityY(200);
  }

  incrementarPuntaje() {
    this.puntaje += 1; // Incrementar el puntaje
    this.textoDePuntaje.setText(`Puntaje: ${this.puntaje}`); // Actualizar el texto del puntaje
  }

  gameOver(jugador) {
    this.physics.pause();
    jugador.setTint(0xff0000);
    console.log("Game over");
  }

  update() {
    this.jugador.setVelocity(0); // Resetea las velocidades antes de actualizar

    // Movimiento hacia la izquierda
    if (this.cursors.left.isDown || this.teclas.left.isDown) {
      this.jugador.setVelocityX(-300);
    }

    // Movimiento hacia la derecha
    if (this.cursors.right.isDown || this.teclas.right.isDown) {
      this.jugador.setVelocityX(300);
    }

    // Movimiento hacia arriba
    if (this.cursors.up.isDown || this.teclas.up.isDown) {
      this.jugador.setVelocityY(-300);
    }

    // Movimiento hacia abajo
    if (this.cursors.down.isDown || this.teclas.down.isDown) {
      this.jugador.setVelocityY(300);
    }
  }
}
