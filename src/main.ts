import Phaser from 'phaser'

import Preloader from './scene/Preloader'
import Game from './scene/Game'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: 'app',
	width: 600,
	height: 400,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
			debug: false
		},
	},
	scene: [Preloader ,Game],
	zoom: 2,
}

export default new Phaser.Game(config)
