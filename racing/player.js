class Player {
    constructor(scene) {
        this.scene = scene;

        this.x = 0;
        this.y = 0;
        this.z = 0;

        this.speed = 0; // current speed

        // max speed to avoid running more than 1 segment per frame (fps=60)
        this.maxSpeed = scene.circuit.segmentLength * 60;

        this.sprite = scene.sprites[PLAYER];
        this.w = this.sprite.width / 1000 * 2;

        this.screen = { x: 0, y: 0, w: 0, h: 0 };
    }

    init() {
        this.screen.w = this.sprite.width;
        this.screen.h = this.sprite.height;

        this.screen.x = SCREEN_CENTERX;
        this.screen.y = SCREEN_HEIGHT - this.screen.h / 2;
    }

    restart() {
        this.x = 0;
        this.y = 0;
        this.z = 0;

        this.speed = this.maxSpeed;
    }

    update(dt) {
        this.z += this.speed * dt; // move forward
    }
}