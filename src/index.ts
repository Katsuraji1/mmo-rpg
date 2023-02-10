import './index.html';
import './index.scss';
import Phaser from 'phaser';

import Game from './scene/Game';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
        },
    },
    scene: [Game],
};

export default new Phaser.Game(config);
