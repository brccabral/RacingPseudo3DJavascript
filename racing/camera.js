class Camera {
    constructor(scene) {
        // reference to the scene
        this.scene = scene;

        // camera world coord - game position
        this.x = 0;
        this.y = 1000;
        this.z = 0;

        // Z-distance between camera and normalized projection plane
        this.distToPlane = 100;
    }
}