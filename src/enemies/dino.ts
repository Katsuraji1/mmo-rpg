import Phaser from 'phaser';
import { Text } from '../utils/text';

export enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGTH,
    UPRIGHT,
    UPLEFT,
    DOWNLEFT,
    DOWNRIGHT,
    IDLE
}

const getRandomDirection = (param: Direction) => {
    let newDirection = Phaser.Math.Between(0, 8);

    while (newDirection === param) {
        newDirection = Phaser.Math.Between(0, 8);
    }

    return newDirection;
}

export default class Dino extends Phaser.Physics.Arcade.Sprite { 

    private direction = Direction.RIGTH;
    private move:  Phaser.Time.TimerEvent;
    private DinoName!: Text;

    constructor(scene: Phaser.Scene, x: number ,y: number , texture: string, frame: string | number ) {
        super (scene, x, y, texture, frame)
        this.anims.play('dino-idle', true);

        scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE, this.tileCollision, this)

        this.DinoName = new Text(scene, x, y, 'Dino Lvl 1');

        this.move = scene.time.addEvent( {
            delay: 2500,
            callback: () => {
                this.direction = getRandomDirection(this.direction);
            },
            loop: true
        } )
    }

    destroy(fromScene?: boolean | undefined): void {
        this.move.destroy();

        super.destroy(fromScene);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private tileCollision (gameObject: Phaser.GameObjects.GameObject, _tile: Phaser.Tilemaps.Tile) {
        if( gameObject !== this ) {
            return
        }
        this.direction = getRandomDirection(this.direction);
    }

    preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta);

        this.DinoName.setPosition(this.x - this.width, this.y - this.height);

        const speed = 50;

        switch (this.direction) {
            case Direction.UP:
            this.setVelocity(0, -speed);
            this.anims.play('dino-run', true);
            break;

            case Direction.DOWN:
            this.setVelocity(0, speed);
            this.anims.play('dino-run', true);
            break;

            case Direction.RIGTH:
            this.setVelocity(speed, 0);
            this.anims.play('dino-run', true);
            break;

            case Direction.LEFT:
            this.setVelocity(-speed, 0);
            this.anims.play('dino-run', true);
            break;

            case Direction.UPLEFT:
                this.setVelocity(-(speed / 2) * Math.sqrt(2), -(speed / 2) * Math.sqrt(2))
                this.anims.play('dino-run', true);
            break;
            
            case Direction.UPRIGHT:
                this.setVelocity((speed / 2) * Math.sqrt(2), -(speed / 2) * Math.sqrt(2))
                this.anims.play('dino-run', true);
            break;

            case Direction.DOWNLEFT:
                this.setVelocity(-(speed / 2) * Math.sqrt(2), (speed / 2) * Math.sqrt(2))
                this.anims.play('dino-run', true);
            break;

            case Direction.DOWNRIGHT:
                this.setVelocity((speed / 2) * Math.sqrt(2), (speed / 2) * Math.sqrt(2))
                this.anims.play('dino-run', true);
            break;

            case Direction.IDLE:
                this.setVelocity(0, 0)
                this.anims.play('dino-idle', true);
            break
        }

    }

}