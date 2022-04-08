class Circuit{
    constructor(scene){
        // reference to the scene
        this.scene = scene;

        // road segments
        this.segments = []

        // single segment length
        this.segmentLength = 100;

        // road width (half, the center is at x=0)
        this.roadWidth = 1000;
    }
}