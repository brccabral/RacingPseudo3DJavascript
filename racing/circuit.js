class Circuit {
    constructor(scene) {
        // reference to the scene
        this.scene = scene;

        // road segments
        this.segments = []

        // single segment length
        this.segmentLength = 100; // height

        // road width (half, the center is at x=0)
        this.roadWidth = 1000;
    }

    create() {
        // clear arrays
        this.segments = [];

        // create a road
        this.createRoad();
    }

    createRoad() {
        // there will be more segments later
        // each segment can be Straight/Curved, Uphill/Downhill/No Slope
        this.createSection(10);
    }

    createSection(nSegments) {
        for (let index = 0; index < nSegments; index++) {
            this.createSegment();
            console.log("Created segment: ", index, " ", this.segments[index]);
        }
    }

    createSegment(){
        // each segment can be on the road, outside (grass) or kerbs
        // road - grey dark/light
        // grass - green dark/light
        // kerb - red/white
        var n = this.segments.length;

        // add new segment
        this.segments.push({
            index: n,
            point:{
                world: {x: 0, y: 0, z: n*this.segmentLength},
                screen: {x: 0, y: 0, z: 0},
                scale: -1,
            },
            color: {
                road: '0x888888'
            }
        })
    }
}