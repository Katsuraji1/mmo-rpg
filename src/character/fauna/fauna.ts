import Phaser from "phaser";

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    export namespace Phaser.GameObjects {
        interface GameObjectFactory {
            fauna(x: number, y: number, texture: string, frame?: string | number): Fauna
        }   
    }
}

enum HealthState {
    IDLE,
    DAMAGE,
    DEAD
}

export default class Fauna extends Phaser.Physics.Arcade.Sprite {

    private healthState = HealthState.IDLE;
    private damageTime = 0;
    private _health = 100;
    private fireballs?: Phaser.Physics.Arcade.Group 

    get health() {
        return this._health;
    }

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super (scene, x, y, texture, frame)

        /* this.name = new Text(this, this.fauna.x - this.fauna.width / 2, this.fauna.y - this.fauna.height, 'Katsuraji');
		this.body.setSize(this.width * 0.5, this.height * 0.8); */
		this.anims.play('fauna-idle-down');
    }

    setFireballs(fireballs: Phaser.Physics.Arcade.Group) {
        this.fireballs = fireballs
    }

    damageHandler(dir: Phaser.Math.Vector2) {
        if (this._health <= 0) {
            return
        }

        if (this.healthState === HealthState.DAMAGE) {
            return
        }

        this._health -= 10;

        if(this._health <= 0) {
            this.healthState = HealthState.DEAD;
            this.anims.play('fauna-die', true);
            this.setVelocity(0, 0)
        } else {
            this.setVelocity(dir.x, dir.y);
            
            this.setTint(0xff0000)
            this.healthState = HealthState.DAMAGE;

            this.damageTime = 0;
        }
    }

    private throwFireball() {
        if(!this.fireballs) {
            return
        }
        const parts = this.anims.currentAnim.key.split('-');
        const direction = parts[2];

        const vector = new Phaser.Math.Vector2(0, 0);

        switch(direction) {
            case 'up':
                vector.y = -1;
                break;
            case 'down':
                vector.y = 1;
                break;
            default:
                case 'side':
                    if(this.scaleX < 0) {
                        vector.x = -1;
                    } else {
                        vector.x = 1;
                    }
                    break;
        }

        const angle = vector.angle();
        const fireball = this.fireballs.get(this.x, this.y, 'fireball') as Phaser.Physics.Arcade.Image;
        fireball.body.setSize(25,25)
        fireball.setRotation(angle);
        fireball.setVelocity(vector.x * 400, vector.y * 400);

        fireball.setActive(true);
        fireball.setVisible(true);
    }

    protected preUpdate(_time: number, _delta: number): void {

        super.preUpdate(_time, _delta);

        switch(this.healthState) {
            case HealthState.IDLE:
                break;
            case HealthState.DAMAGE:
                this.damageTime += _delta
                if (this.damageTime >= 250) {
                    this.healthState = HealthState.IDLE;
                    this.setTint(0xffffff)
                    this.damageTime = 0
                }
                break;
        }
    }

    update(keyA: Phaser.Input.Keyboard.Key, keyD: Phaser.Input.Keyboard.Key, keyS: Phaser.Input.Keyboard.Key, keyW: Phaser.Input.Keyboard.Key, KeySpace: Phaser.Input.Keyboard.Key) {
        if(this.healthState === HealthState.DAMAGE || this.healthState === HealthState.DEAD) {
            return
        }
        const speed = 300;
	if( keyW.isDown && keyA.isDown ) {
		this.anims.play('fauna-run-up', true);
		this.setVelocity(-(speed / 2) * Math.sqrt(2), -(speed / 2) * Math.sqrt(2))
	} else if( keyW.isDown && keyD.isDown ) {
		this.anims.play('fauna-run-up', true);
		this.setVelocity((speed / 2) * Math.sqrt(2), -(speed / 2) * Math.sqrt(2))
	} else if( keyA.isDown && keyS.isDown ) {
		this.anims.play('fauna-run-down', true);
		this.setVelocity(-(speed / 2) * Math.sqrt(2), (speed / 2) * Math.sqrt(2))
	} else if( keyD.isDown && keyS.isDown ) {
		this.anims.play('fauna-run-down', true);
		this.setVelocity((speed / 2) * Math.sqrt(2), (speed / 2) * Math.sqrt(2))
	} else if(keyA.isDown) {
		this.anims.play('fauna-run-side', true);
		this.setVelocity(-speed, 0)
		this.scaleX = -1;
		this.body.offset.x = 24;
	} else if(keyS.isDown) {
		this.anims.play('fauna-run-down', true);
		this.setVelocity(0, speed)
	} else if(keyD.isDown) {
		this.anims.play('fauna-run-side', true);
		this.setVelocity(speed, 0)
		this.scaleX = 1;
		this.body.offset.x = 8;
	} else if(keyW.isDown) {
		this.anims.play('fauna-run-up', true);
		this.setVelocity(0, -speed)
		this.anims.play('fauna-run-up', true);
	}
	else {
        const parts = this.anims.currentAnim.key.split('-');
        parts[1] = 'idle'
		this.anims.play(parts.join('-'), true);
        this.setVelocity(0, 0);
	}

    if(Phaser.Input.Keyboard.JustDown(KeySpace)) {
        this.throwFireball();
        return
    }
    }
}

Phaser.GameObjects.GameObjectFactory.register('fauna', function (this: Phaser.GameObjects.GameObjectFactory,x: number, y: number, texture: string, frame?: string | number ) {
    const sprite = new Fauna(this.scene, x, y, texture, frame);

    this.displayList.add(sprite);
    this.updateList.add(sprite);

    this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY);

    sprite.body.setSize(sprite.width * 0.5, sprite.height * 0.8);

    return sprite;
})