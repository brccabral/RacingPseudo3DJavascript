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
    preload() {
        this.load.image('imgBack', 'racing/assets/img_back.png');
    }
    /**
    * Creates objects, setup scene inputs
    */
    create() {
        // background sprite
        this.sprBack = this.add.image(SCREEN_CENTERX, SCREEN_CENTERY, 'imgBack');

        // instances
        this.circuit = new Circuit(this);
        this.settings = new Settings(this);

        // listener to pause game
        this.input.keyboard.on('keydown-P', function () {
            this.settings.txtPause.text = '[P] Resume';
            this.scene.pause(); // pauses current scene
            this.scene.launch('ScenePause'); // launches another scene by "key"
        }, this);

        // listener on resume event
        this.events.on('resume', function () {
            this.settings.show();
        }, this);
    }
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
                this.circuit.create();
                state = STATE_PLAY;
                break;

            case STATE_PLAY:
                console.log('Playing game');
                this.circuit.render2D();
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
    create() {
        // listener to resume game
        this.input.keyboard.on('keydown-P', function () {
            this.scene.resume('SceneMain'); // resume other scene from paused by "key"
            this.scene.stop(); // stop this scene
        }, this);
    }
    update(time, delta) { }
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