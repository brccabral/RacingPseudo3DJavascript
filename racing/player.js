class Player {
    constructor(scene) {
        this.scene = scene;

        this.x = 0;
        this.y = 0;
        this.z = 0;

        this.speed = 0; // current speed

        // max speed to avoid running more than 1 segment per frame (fps=60)
        this.maxSpeed = scene.circuit.segmentLength * 60;
    }

    restart(){
        this.x = 0;
        this.y = 0;
        this.z = 0;

        this.speed = this.maxSpeed;
    }

    update(dt){
        this.z += this.speed * dt; // move forward
    }
}