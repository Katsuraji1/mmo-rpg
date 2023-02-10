import Phaser from 'phaser'

export default class Game extends Phaser.Scene {
	constructor() {
		super('game')
	}

	preload() {
	}

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	create() {
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
}
}