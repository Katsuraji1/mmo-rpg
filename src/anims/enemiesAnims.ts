const dinoAnims = (anims: Phaser.Animations.AnimationManager) => {
    anims.create( {
        key: 'dino-idle',
        frames: anims.generateFrameNames('dino', {start: 0, end: 3, prefix: 'DinoSprites - mort-', suffix: '.png'}),
        repeat: -1,
        frameRate: 10
    } )

    anims.create( {
        key: 'dino-run',
        frames: anims.generateFrameNames('dino', {start: 4, end: 7, prefix: 'DinoSprites - mort-', suffix: '.png'}),
        repeat: -1,
        frameRate: 10
    } )
}

export {
    dinoAnims,
}