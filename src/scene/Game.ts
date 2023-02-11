import Phaser from 'phaser'

import { dinoAnims } from '../anims/enemiesAnims';
import { FaunaAnimation } from '../anims/characterAnims';
import { Text } from '../utils/text';

import Dino from '../enemies/dino';

let keyA: Phaser.Input.Keyboard.Key;
let keyS: Phaser.Input.Keyboard.Key;
let keyD: Phaser.Input.Keyboard.Key;
let keyW: Phaser.Input.Keyboard.Key;
export default class Game extends Phaser.Scene {

	private fauna!: Phaser.Physics.Arcade.Sprite;
	private name!: Text;

	constructor() {
		super('game')
	}

	preload() {
		keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
		keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
		keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
		keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
	}

	create() {
		FaunaAnimation(this.anims);
		dinoAnims(this.anims);
		const map = this.make.tilemap({ key: 'map' });
		const tileSet = map.addTilesetImage('Tiles', 'tiles', 16, 16);
		const MasterSimpleTileSet = map.addTilesetImage('MasterSimple', 'MasterSimple');

		map.createLayer('ground', [tileSet]);
		const wallsLayer = map.createLayer('walls', [tileSet, MasterSimpleTileSet]);
		wallsLayer.setCollisionByProperty({collides: true})

		this.fauna = this.physics.add.sprite(300, 300, 'fauna', 'walk-down-3.png');
		this.name = new Text(this, this.fauna.x - this.fauna.width / 2, this.fauna.y - this.fauna.height, 'Katsuraji');
		//debug(wallsLayer, this)

		this.fauna.body.setSize(this.fauna.width * 0.5, this.fauna.height * 0.8);
		this.cameras.main.startFollow(this.fauna, true);

		const Dinos = this.physics.add.group( {
			classType: Dino,
			createCallback: (gameObject) => {
				const DinosGameObject = gameObject as Dino
				DinosGameObject.body.onCollide = true;
			}
		} )

		Dinos.get(359, 359, 'dino')
		this.physics.add.collider(this.fauna, wallsLayer);
		this.physics.add.collider(Dinos, wallsLayer);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
update(_time: number, _delta: number): void {
	this.name.setPosition(this.fauna.x - this.fauna.width / 2, this.fauna.y - this.fauna.height);
	const speed = 75;
	if( keyW.isDown && keyA.isDown ) {
		this.fauna.anims.play('fauna-run-up', true);
		this.fauna.setVelocity(-(speed / 2) * Math.sqrt(2), -(speed / 2) * Math.sqrt(2))
	} else if( keyW.isDown && keyD.isDown ) {
		this.fauna.anims.play('fauna-run-up', true);
		this.fauna.setVelocity((speed / 2) * Math.sqrt(2), -(speed / 2) * Math.sqrt(2))
	} else if( keyA.isDown && keyS.isDown ) {
		this.fauna.anims.play('fauna-run-down', true);
		this.fauna.setVelocity(-(speed / 2) * Math.sqrt(2), (speed / 2) * Math.sqrt(2))
	} else if( keyD.isDown && keyS.isDown ) {
		this.fauna.anims.play('fauna-run-down', true);
		this.fauna.setVelocity((speed / 2) * Math.sqrt(2), (speed / 2) * Math.sqrt(2))
	} else if(keyA.isDown) {
		this.fauna.anims.play('fauna-run-side', true);
		this.fauna.setVelocity(-speed, 0)
		this.fauna.scaleX = -1;
		this.fauna.body.offset.x = 24;
	} else if(keyS.isDown) {
		this.fauna.anims.play('fauna-run-down', true);
		this.fauna.setVelocity(0, speed)
	} else if(keyD.isDown) {
		this.fauna.anims.play('fauna-run-side', true);
		this.fauna.setVelocity(speed, 0)
		this.fauna.scaleX = 1;
		this.fauna.body.offset.x = 8;
	} else if(keyW.isDown) {
		this.fauna.anims.play('fauna-run-up', true);
		this.fauna.setVelocity(0, -speed)
		this.fauna.anims.play('fauna-run-up', true);
	}
	else {
		this.fauna.setVelocity(0, 0);
		this.fauna.anims.play('fauna-idle-down', true);
	}
}
}