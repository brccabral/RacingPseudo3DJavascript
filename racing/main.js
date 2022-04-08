/****
 * Pseudo-3D Racing game prototype
 * 
 * @author Srdjan Susnic (tutorial), Bruno Cabral (edited)
 * @copyright 2021 Ask For Game Task, B_code_tube
 * @website http://askforgametask.com , https://github.com/brccabral/RacingPseudo3DJavascript
 */

// Global

// screen
const SCREEN_WIDTH = 1920;
const SCREEN_HEIGHT = 1080;
const SCREEN_CENTERX = SCREEN_WIDTH / 2;
const SCREEN_CENTERY = SCREEN_HEIGHT / 2;

// game states
const STATE_INIT = 1;
const STATE_RESTART = 2;
const STATE_PLAY = 3;
const STATE_GAMEOVER = 4;

// current state
var state = STATE_INIT;

class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SceneMain' });
    }
    /**
    * Loads all assets.
    */
    preload() { }
    /**
    * Creates objects, setup scene inputs
    */
    create() { }
    /**
    * Main Game Loop
    */
    update(time, delta) {
        // state machine
        switch (state) {
            case STATE_INIT:
                console.log('Init game');
                state = STATE_RESTART;
                break;

            case STATE_RESTART:
                console.log('Restart game');
                state = STATE_PLAY;
                break;

            case STATE_PLAY:
                console.log('Playing game');
                break;

            case STATE_GAMEOVER:
                console.log('Game over');
                break;
        }
    }
}
class PauseScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ScenePause' });
    }
    create() { }
}

// game configuration
var config = {
    type: Phaser.AUTO,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,

    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },

    scene: [MainScene, PauseScene]
};

// game instance
var game = new Phaser.Game(config);