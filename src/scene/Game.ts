import Phaser from 'phaser'

import { dinoAnims } from '../anims/enemiesAnims';
import { FaunaAnimation } from '../anims/characterAnims';
import { Text } from '../utils/text';
import { newEvent as events } from '../events/eventCenter';

import '../character/fauna/fauna'

import Dino from '../enemies/dino';
import Fauna from '../character/fauna/fauna';
//import { debug } from '../utils/debug';

let keyA: Phaser.Input.Keyboard.Key;
let keyS: Phaser.Input.Keyboard.Key;
let keyD: Phaser.Input.Keyboard.Key;
let keyW: Phaser.Input.Keyboard.Key;
let keySpace: Phaser.Input.Keyboard.Key;
export default class Game extends Phaser.Scene {

	private fauna!: Fauna;
	private name!: Text;
	private dinos!: Phaser.GameObjects.Group;
	private minimap!: Phaser.Cameras.Scene2D.Camera;
	private CollidesBetweenPlayerAndMob?: Phaser.Physics.Arcade.Collider;
	private fireballs!: Phaser.Physics.Arcade.Group;

	constructor() {
		super('game')
	}

	preload() {
		keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
		keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
		keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
		keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
		keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
	}
/* 
	enemyFollows() {
		this.dinos?.children.each(child => {
			const dino = child as Dino;
			this.RANGE = Phaser.Math.Distance.Between(dino.x, dino.y, this.fauna.x, this.fauna.y);
			if(this.RANGE <= 200) {
				this.physics.moveToObject(dino, this.fauna);
				console.log(this.RANGE);
			} else {
				return
			}
		})
	} */

	create() {
		this.scene.launch('ui-scene');
		FaunaAnimation(this.anims);
		dinoAnims(this.anims);
		const map = this.make.tilemap({ key: 'map' });
		const tileSet = map.addTilesetImage('Tiles', 'tiles', 16, 16);
		const MasterSimpleTileSet = map.addTilesetImage('MasterSimple', 'MasterSimple');
		const townTileSet = map.addTilesetImage('town', 'town')
		const treesTileSet = map.addTilesetImage('Trees','trees')

		this.minimap = this.cameras.add(450, 10, 100, 100).setZoom(0.12).setName('mini');
        this.minimap.setBackgroundColor(0x002244);
        this.minimap.scrollX = 300;
        this.minimap.scrollY = 150;

		map.createLayer('ground', [tileSet, townTileSet, MasterSimpleTileSet]);
		const wallsLayer = map.createLayer('walls', [tileSet, MasterSimpleTileSet, townTileSet, treesTileSet]);
		wallsLayer.setCollisionByProperty({collides: true})


		this.fireballs = this.physics.add.group( {
			classType: Phaser.Physics.Arcade.Image
		} )

		this.fauna = this.add.fauna(300, 300, 'fauna');
		this.fauna.setFireballs(this.fireballs);

		this.name = new Text(this, this.fauna.x - this.fauna.width / 2, this.fauna.y - this.fauna.height, 'Katsuraji');

		//debug(wallsLayer, this)
		this.cameras.main.startFollow(this.fauna, true);

		this.dinos = this.physics.add.group( {
			classType: Dino,
			createCallback: (gameObject) => {
				const DinosGameObject = gameObject as Dino
				DinosGameObject.body.onCollide = true;
			}
		} )

		this.dinos.get(359, 359, 'dino')
		this.physics.add.collider(this.fauna, wallsLayer);
		this.physics.add.collider(this.dinos, wallsLayer);
		this.physics.add.collider(this.fireballs, wallsLayer, this.FireballWallsCollisionHandler, undefined,this);

		this.physics.add.collider(this.fireballs, this.dinos, this.MobFireballCollisionHandler, undefined, this);

		this.CollidesBetweenPlayerAndMob = this.physics.add.collider(this.dinos, this.fauna,this.PlayerAndModCollision, undefined, this)

		this.dinos.children.each((child => {
			const dino = child as Dino
			dino.setTarget(this.fauna);
		}))

}

private MobFireballCollisionHandler = (_obj1: Phaser.GameObjects.GameObject, _obj2: Phaser.GameObjects.GameObject) => {
	this.fireballs.killAndHide(_obj1);
	this.dinos.killAndHide(_obj2);
}

private FireballWallsCollisionHandler = (_obj1: Phaser.GameObjects.GameObject, _obj2: Phaser.GameObjects.GameObject) => {
	this.fireballs.killAndHide(_obj1);
}



private PlayerAndModCollision = (_obj1: Phaser.GameObjects.GameObject, _obj2: Phaser.GameObjects.GameObject) => {
	const dino = _obj2 as Dino

	const dx = this.fauna.x - dino.x;
	const dy = this.fauna.y - dino.y;

	const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(100);
	this.fauna.damageHandler(dir);

	events.emit('player-health-changed', this.fauna.health)

	if(this.fauna.health <= 0) {
		this.CollidesBetweenPlayerAndMob?.destroy()
	}
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
update(_time: number, _delta: number): void {
	this.minimap.scrollX = Phaser.Math.Clamp(this.fauna.x, 0, 1500);
	this.minimap.scrollY = Phaser.Math.Clamp(this.fauna.y, 0, 1500);
/* 	this.enemyFollows(); */
	this.name.setPosition(this.fauna.x - this.fauna.width / 2, this.fauna.y - this.fauna.height);
	if(this.fauna) {
		this.fauna.update(keyA, keyD, keyS, keyW, keySpace);
	}
}
}