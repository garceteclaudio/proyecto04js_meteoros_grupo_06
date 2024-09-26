export default class Escena1 extends Phaser.Scene {
  constructor() {
    super("Escena 1");
    this.jugador = null;
    this.grupoMeteoros = null;
    this.cursors = null;
  }

  preload() {
    this.load.image("cielo", "/public/resources/images/cielo.png");
    this.load.image("nave", "/public/resources/images/nave.png");
    this.load.image("meteoro", "/public/resources/images/meteoro.png");
  }

  create() {
    this.add.image(400, 300, "cielo");
    this.jugador = this.physics.add.sprite(400, 550, "nave");
    this.jugador.setCollideWorldBounds(true); //evita q salga de la pantalla

    this.grupoMeteoros = this.physics.add.group(); //creando el grupo de meteoritos

    this.time.addEvent({
      delay: 1000,
      callback: this.generarMeteoros,
      callbackScope: this,
      loop: true,
    });

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  generarMeteoros() {
    const x = Phaser.Math.Between(0, 800);
    const meteoro = this.grupoMeteoros.create(x, 0, "meteoro");

    meteoro.setVelocityY(200);
  }

  update() {
    this.jugador.setVelocityX(0);

    if (this.cursors.left.isDown) {
      this.jugador.setVelocityX(-300);
    } else if (this.cursors.right.isDown) {
      this.jugador.setVelocityX(300);
    }
  }
}
