class Camera {
    constructor(scene) {
        // reference to the scene
        this.scene = scene;

        // camera world coord - game position
        this.x = 0;
        this.y = 1000;
        this.z = 0;

        // Z-distance between camera and player
        this.distToPlayer = 500;

        // Z-distance between camera and normalized projection plane
        this.distToPlane = null;
    }

    /**
     * Initializes camera. It is called when start game or when changing settings (zoom view)
     */
    init() {
        this.distToPlane = 1 / (this.y / this.distToPlayer)
    }

    update() {
        var player = this.scene.player;
        var circuit = this.scene.circuit;

        // player X is normalized [-1, 1]
        this.x = player.x * circuit.roadWidth;
        // place the camera behind the player
        this.z = player.z - this.distToPlayer;

        // don't let camera Z to go negative
        if (this.z < 0) this.z += circuit.roadLength;
    }
}