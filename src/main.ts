import Phaser from 'phaser'

import Preloader from './Preloader'
import Game from './Game'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: 'app',
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
		},
	},
	scene: [Preloader ,Game],
}

export default new Phaser.Game(config)
