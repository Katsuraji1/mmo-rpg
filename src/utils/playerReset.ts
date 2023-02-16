import Phaser from "phaser";
import Fauna from "../character/fauna/fauna";
import { newEvent as events } from '../events/eventCenter';

function playerReset(player: Phaser.Physics.Arcade.Sprite) {
    const newPlayer = player as Fauna
        newPlayer.disableBody(true, true);
        newPlayer.RespawnHealth = 50;
        events.emit('player-health-changed', 50)
        newPlayer.enableBody(true, 300, 300, true, true);
}

export {
    playerReset
}