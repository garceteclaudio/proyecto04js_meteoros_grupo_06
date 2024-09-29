export default class Escena1 extends Phaser.Scene {
  constructor() {
    super("Escena 1");
    this.jugador = null;
    this.grupoMeteoros = null;
    this.cursors = null;
    this.teclas = null;
    this.puntaje = 0;
    this.textoDePuntaje = null;
    this.juegoTerminado = false;
  }

  preload() {
    this.load.image("espacio", "/public/resources/images/espacio.png");
    this.load.spritesheet("nave", "/public/resources/images/nave.png",  {frameWidth:60, frameHeight: 60});
    this.load.image("meteoro", "/public/resources/images/meteoro.png", {frameWidth:56, frameHeight: 60});
  }

  create() {
    this.add.image(400, 300, "espacio");
    this.jugador = this.physics.add.sprite(400, 550, "nave", 0);
    this.jugador.setCollideWorldBounds(true);

    this.grupoMeteoros = this.physics.add.group();

    this.anims.create({
      key: "izquierda",
      frames:[{ key: "nave", frame : 1 }],
      frameRate: 20
    })

    this.anims.create({
      key: "normal",
      frames:[{ key: "nave", frame : 0 }],
      frameRate: 20
    })

    this.anims.create({
      key: "derecha",
      frames:[{ key: "nave", frame : 2 }],
      frameRate: 20
    })

    this.time.addEvent({
      delay: 1000,
      callback: this.generarMeteoros,
      callbackScope: this,
      loop: true,
    });

    // Evento para incrementar el puntaje cada décima de segundo
    this.incrementoPuntajeEvento = this.time.addEvent({
      delay: 100,
      callback: this.incrementarPuntaje,
      callbackScope: this,
      loop: true,
    });

    this.cursors = this.input.keyboard.createCursorKeys();

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
    if (!this.juegoTerminado) {
      this.puntaje += 1;
      this.textoDePuntaje.setText(`Puntaje: ${this.puntaje}`);
    }
  }

  gameOver(jugador) {
    this.juegoTerminado = true; // El juego ha terminado
    this.physics.pause(); // Pausa la física del juego
    this.incrementoPuntajeEvento.remove(); // Detiene el evento que incrementa el puntaje
    jugador.setTint(0xff0000);

    this.add
      .text(400, 300, `Has muerto! Juego Terminado. Puntaje: ${this.puntaje}`, {
        fontSize: "30px",
        fill: "#fff",
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0.5); // Centrar el texto en las coordenadas
  }

  update() {
    if (this.juegoTerminado) return; // No actualizar si el juego ha terminado

    this.jugador.setVelocity(0); // Resetea las velocidades antes de actualizar

    if (this.cursors.left.isDown || this.teclas.left.isDown) {
      this.jugador.setVelocityX(-300);
      this.jugador.anims.play("izquierda", true);
    } else if (this.cursors.right.isDown || this.teclas.right.isDown) { 
      this.jugador.setVelocityX(300);
      this.jugador.anims.play("derecha", true);
    } else if (this.cursors.up.isDown || this.teclas.up.isDown) {
      this.jugador.setVelocityY(-300);
      this.jugador.anims.play("normal", true);
    } else if (this.cursors.down.isDown || this.teclas.down.isDown) {
      this.jugador.setVelocityY(300);
      this.jugador.anims.play("normal", true);
    } else {
      this.jugador.anims.play("normal", true);
    }
  }
}
