import Phaser from 'phaser'
let keyA: Phaser.Input.Keyboard.Key;
let keyS: Phaser.Input.Keyboard.Key;
let keyD: Phaser.Input.Keyboard.Key;
let keyW: Phaser.Input.Keyboard.Key;
export default class Game extends Phaser.Scene {

	private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
	private fauna!: Phaser.Physics.Arcade.Sprite;

	constructor() {
		super('game')
	}

	preload() {
	}

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	create() {
		keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
		keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
		keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
		keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
		const map = this.make.tilemap({ key: 'map' });
		const tileSet = map.addTilesetImage('Tiles', 'tiles');

		map.createLayer('ground', tileSet);
		const wallsLayer = map.createLayer('walls', tileSet);
		wallsLayer.setCollisionByProperty({collides: true})

		const debugGraphics = this.add.graphics().setAlpha(0.75);
		wallsLayer.renderDebug(debugGraphics, {
			tileColor: null,
			collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
			faceColor: new Phaser.Display.Color(40, 39, 37, 255)
		})

		this.fauna = this.physics.add.sprite(300, 300, 'fauna', 'walk-down-3.png');

		this.anims.create( {
			key: 'fauna-idle-down',
			frames: [ {key: 'fauna', frame: 'walk-down-3.png'} ]
		} )

		this.anims.create( {
			key: 'fauna-idle-up',
			frames: [ {key: 'fauna', frame: 'walk-up-3.png'} ]
		} )

		this.anims.create( {
			key: 'fauna-idle-side',
			frames : [{ key: 'fauna', frame: 'walk-side-3.png'}]
		} )

		this.anims.create( {
			key: 'fauna-run-down',
			frames: this.anims.generateFrameNames('fauna', { start: 0, end: 8, prefix: 'run-down-', suffix: '.png' }),
			repeat: -1,
			frameRate: 15,
		} )

		this.anims.create( {
			key: 'fauna-run-side',
			frames: this.anims.generateFrameNames('fauna', {start: 0, end: 8, prefix: 'run-side-', suffix: '.png'}),
			repeat: -1,
			frameRate: 15,
		})

		this.anims.create( {
			key: 'fauna-run-up',
			frames: this.anims.generateFrameNames('fauna', {start: 0, end: 8, prefix: 'run-up-', suffix: '.png'}),
			repeat: -1,
			frameRate: 15,
		})
		this.fauna.anims.play('fauna-run-up')
}

update(time: number, delta: number): void {
	const speed = 50
	if( keyW.isDown && keyA.isDown ) {
		this.fauna.setVelocity(-speed, -speed)
	} else if( keyW.isDown && keyD.isDown ) {
		this.fauna.setVelocity(speed, -speed)
	} else if( keyA.isDown && keyS.isDown ) {
		this.fauna.setVelocity(-speed, speed)
	} else if( keyD.isDown && keyS.isDown ) {
		this.fauna.setVelocity(speed, speed)
	} else if(keyA.isDown) {
		this.fauna.setVelocity(-speed, 0)
	} else if(keyS.isDown) {
		this.fauna.setVelocity(0, speed)
	} else if(keyD.isDown) {
		this.fauna.setVelocity(speed, 0)
	} else if(keyW.isDown) {
		this.fauna.setVelocity(0, -speed)
	}
	else {
		this.fauna.setVelocity(0, 0);
	}
}
}