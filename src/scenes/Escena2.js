export default class Escena2 extends Phaser.Scene {
  constructor() {
    super({ key: "Escena 2" });
    this.jugador = null;
    this.grupoMeteoros = null;
    this.grupoBalas = null;
    this.grupoEnemigosNave = null; // Nuevo grupo para enemigosNave
    this.cursors = null;
    this.teclas = null;
    this.puntaje = 0;
    this.textoDePuntaje = null;
    this.juegoTerminado = false;
    this.musicaFondo = null;
    this.sonidoGrito = null;
    this.siguienteDisparo = 0;
    this.sonidoBala = null;
    this.sonidoExplosion = null;
  }
  generarMeteoros() {
    if (this.juegoTerminado) return;

    const y = Phaser.Math.Between(0, 600);
    const meteoro = this.grupoMeteoros.create(800, y, "meteoro");
    meteoro.setVelocityX(-200); // Meteoro se mueve hacia la izquierda
  }

  dispararBala() {
    const tiempoActual = this.time.now;

    if (tiempoActual > this.siguienteDisparo) {
      const bala = this.grupoBalas.get(this.jugador.x + 50, this.jugador.y); // Posicionar la bala a la derecha de la nave

      if (bala) {
        bala.setActive(true);
        bala.setVisible(true);
        bala.setVelocityX(500); // Disparar hacia la derecha
        this.siguienteDisparo = tiempoActual + 300;

        this.sonidoBala.play();
      }
    }
  }
  destruirMeteoro(bala, meteoro) {
    // Destruir meteoro y bala
    meteoro.destroy();
    bala.destroy();

    // Reproducir el sonido de la bala
    this.sonidoExplosion.play();
  }

  incrementarPuntaje() {
    if (!this.juegoTerminado) {
      this.puntaje += 1;
      this.textoDePuntaje.setText(`Puntaje: ${this.puntaje}`);
    }
  }

  generarEnemigosNave() {
    if (this.juegoTerminado) return;

    const y = Phaser.Math.Between(50, 550);
    const enemigoNave = this.grupoEnemigosNave.create(800, y, "enemigoNave");
    enemigoNave.setVelocityX(-150); // EnemigoNave se mueve hacia la izquierda
    enemigoNave.vidas = 3; // Se requieren 3 disparos para destruir
  }

  colisionBalaEnemigo(bala, enemigoNave) {
    /* enemigoNave.vidas -= 1; // Reducir una vida por disparo
    bala.destroy();

    if (enemigoNave.vidas <= 0) {
      enemigoNave.destroy();
      this.sonidoExplosion.play();
    }*/
    // Destruir meteoro y bala
    enemigoNave.destroy();
    bala.destroy();

    // Reproducir el sonido de la bala
    this.sonidoExplosion.play();
  }

  colisionJugadorEnemigo(jugador, enemigoNave) {
    this.scene.start("GameOver", { puntaje: this.puntaje });
    this.musicaFondo.stop();
    this.puntaje = 0;
    this.juegoTerminado = true;
    enemigoNave.destroy();
  }

  preload() {
    this.load.image("espacio", "/public/resources/images/espacio.png");
    this.load.spritesheet("nave", "/public/resources/images/nave.png", {
      frameWidth: 60,
      frameHeight: 60,
    });
    this.load.image("meteoro", "/public/resources/images/meteoro.png");
    this.load.image("bala2", "/public/resources/images/balaHorizontal.png");
    this.load.image("enemigoNave", "/public/resources/images/enemigoNave.png"); // Cargar imagen del enemigo
    this.load.audio("musicaFondo", "/public/resources/sounds/9.mp3");
    this.load.audio("grito", "/public/resources/sounds/grito.mp3");
    this.load.audio("balaSonido", "/public/resources/sounds/balaSonido.mp3");
    this.load.audio(
      "sonidoExplosion",
      "/public/resources/sounds/sonidoExplosion.mp3"
    );
  }

  create() {
    this.add.image(400, 300, "espacio");
    this.jugador = this.physics.add.sprite(100, 300, "nave", 0);
    this.jugador.setCollideWorldBounds(true);
    this.jugador.setAngle(90); // Nave rotada para disparar hacia la derecha

    this.grupoBalas = this.physics.add.group({
      defaultKey: "bala2",
      maxSize: 20,
    });

    this.grupoMeteoros = this.physics.add.group();
    this.grupoEnemigosNave = this.physics.add.group();

    this.anims.create({
      key: "izquierda",
      frames: [{ key: "nave", frame: 1 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "normal",
      frames: [{ key: "nave", frame: 0 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "derecha",
      frames: [{ key: "nave", frame: 2 }],
      frameRate: 20,
    });

    // Generar enemigosNave periódicamente
    this.time.addEvent({
      delay: 1000, // Cada 2 segundos
      callback: this.generarEnemigosNave,
      callbackScope: this,
      loop: true,
    });

    this.time.addEvent({
      delay: 1000,
      callback: this.generarMeteoros,
      callbackScope: this,
      loop: true,
    });
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
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
    });

    // aca tengo q poner esto: this.musicaFondo.stop();
    this.physics.add.collider(
      this.jugador,
      this.grupoMeteoros,
      (jugador, meteoro) => {
        meteoro.destroy(); // Destruye el meteoro
        this.scene.start("GameOver", { puntaje: this.puntaje }); // Inicia la escena GameOver y pasa el puntaje
        this.musicaFondo.stop();
        this.puntaje = 0;
      },
      null,
      this
    );

    // Colisión entre balas y meteoros
    this.physics.add.collider(
      this.grupoBalas,
      this.grupoMeteoros,
      this.destruirMeteoro,
      null,
      this
    );

    this.physics.add.collider(
      this.jugador,
      this.grupoEnemigosNave,
      this.colisionJugadorEnemigo,
      null,
      this
    );

    this.physics.add.collider(
      this.grupoBalas,
      this.grupoEnemigosNave,
      this.colisionBalaEnemigo,
      null,
      this
    );

    this.textoDePuntaje = this.add.text(16, 16, "Puntaje: 0", {
      fontSize: "32px",
      fill: "#fff",
    });

    this.musicaFondo = this.sound.add("musicaFondo", { loop: true });
    this.musicaFondo.play();
    this.sonidoGrito = this.sound.add("grito");
    this.sonidoBala = this.sound.add("balaSonido");
    this.sonidoExplosion = this.sound.add("sonidoExplosion");
  }

  update() {
    if (this.juegoTerminado) return;

    this.jugador.setVelocity(0);

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

    if (this.teclas.space.isDown) {
      this.dispararBala();
    }
  }
}
