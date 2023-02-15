import Phaser from 'phaser';
import { Text } from '../utils/text';
import Fauna from '../character/fauna/fauna';
import { newEvent as events } from "../events/eventCenter";

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
    private target!: Phaser.GameObjects.Components.Transform;
    private RANGE!: number;
    private Player!: Fauna;
    private _health = 100;
    private graphics!: Phaser.GameObjects.Graphics;

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

        this.graphics = scene.add.graphics();
        this.setHealthBar(100);

        events.on('dino-health-changed',this.handleHealthPlayerChanged ,this);
    }

    handleHealthPlayerChanged(value: number) {
        this.setHealthBar(value);
    }

    getHealth() {
        return this._health;
    }

    setHealth(health: number) {
        this._health = health;
    }

    setTarget(target: Phaser.GameObjects.Components.Transform) {
        this.target = target;
    }

    destroy(fromScene?: boolean): void {
        this.move.destroy();
        this.graphics?.destroy();
        this.DinoName.destroy();

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

        if(!this.graphics) {
            return
        }

        this.graphics.x = this.x - 13
        this.graphics.y = this.y - 25

        this.setTarget;

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

        if (!this.target) {
            return
        } 


        this.RANGE = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y)
        this.Player = this.target as Fauna
        if (this.Player.health > 0) {
            if(this.RANGE <= 100) {
                this.scene.physics.moveToObject(this, this.target);
            } else {
                return
            }
        } else {
            return
        }
    }

    private setHealthBar(value: number) {
        const width = 25;
        const percent = Phaser.Math.Clamp(value, 0, 100) / ( width * 4 );

        this.graphics.fillStyle(0x808080);
        this.graphics.fillRect(0, 0, width, 4);

        if (percent > 0) {
            this.graphics.fillStyle(0x00ff00)
            this.graphics.fillRect(0, 0, percent * width, 4);
        }
    }
}