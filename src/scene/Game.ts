import Phaser from 'phaser'

import { dinoAnims } from '../anims/enemiesAnims';
import { FaunaAnimation } from '../anims/characterAnims';
import { Text } from '../utils/text';
import { newEvent as events } from '../events/eventCenter';

import '../character/fauna/fauna'

import Dino from '../enemies/dino';
import Fauna from '../character/fauna/fauna';

let keyA: Phaser.Input.Keyboard.Key;
let keyS: Phaser.Input.Keyboard.Key;
let keyD: Phaser.Input.Keyboard.Key;
let keyW: Phaser.Input.Keyboard.Key;
export default class Game extends Phaser.Scene {

	private fauna!: Fauna;
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
		this.scene.launch('ui-scene');
		FaunaAnimation(this.anims);
		dinoAnims(this.anims);
		const map = this.make.tilemap({ key: 'map' });
		const tileSet = map.addTilesetImage('Tiles', 'tiles', 16, 16);
		const MasterSimpleTileSet = map.addTilesetImage('MasterSimple', 'MasterSimple');
		const townTileSet = map.addTilesetImage('town', 'town')

		map.createLayer('ground', [tileSet, townTileSet, MasterSimpleTileSet]);
		const wallsLayer = map.createLayer('walls', [tileSet, MasterSimpleTileSet, townTileSet]);
		wallsLayer.setCollisionByProperty({collides: true})

		this.fauna = this.add.fauna(300, 300, 'fauna');

		this.name = new Text(this, this.fauna.x - this.fauna.width / 2, this.fauna.y - this.fauna.height, 'Katsuraji');

		//debug(wallsLayer, this)
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

		this.physics.add.collider(Dinos, this.fauna,this.PlayerAndModCollision, undefined, this)

}

private PlayerAndModCollision = (_obj1: Phaser.GameObjects.GameObject, _obj2: Phaser.GameObjects.GameObject) => {
	const dino = _obj2 as Dino

	const dx = this.fauna.x - dino.x;
	const dy = this.fauna.y - dino.y;

	const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(100);
	this.fauna.damageHandler(dir);

	events.emit('player-health-changed', this.fauna.health)
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
update(_time: number, _delta: number): void {

	this.name.setPosition(this.fauna.x - this.fauna.width / 2, this.fauna.y - this.fauna.height);
	if(this.fauna) {
		this.fauna.update(keyA, keyD, keyS, keyW);
	}
}
}