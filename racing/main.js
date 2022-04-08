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

