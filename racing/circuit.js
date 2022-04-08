class Circuit {
    constructor(scene) {
        // reference to the scene
        this.scene = scene;

        // graphics to draw the road polygons on it
        this.graphics = scene.add.graphics(0, 0);

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

    createSegment() {
        // each segment can be on the road, outside (grass) or kerbs
        // road - grey dark/light
        // grass - green dark/light
        // kerb - red/white
        var n = this.segments.length;

        // add new segment
        this.segments.push({
            index: n,
            point: {
                world: { x: 0, y: 0, z: n * this.segmentLength }, // game position
                screen: { x: 0, y: 0, w: 0 }, // screen position
                scale: -1,
            },
            color: {
                road: '0x888888'
            }
        })
    }

    /**
     * Renders the road (2D view)
     */
    render2D() {
        // get current and previous segments
        var currSegment = this.segments[1];
        var prevSegment = this.segments[0];

        this.project2D(currSegment.point);
        this.project2D(prevSegment.point);

        var p1 = prevSegment.point.screen;
        var p2 = currSegment.point.screen;

        this.drawSegment(p1, p2, currSegment.color);

        // console.log("Previous segment: ", p1);
        // console.log("Current segment: ", p2);
    }

    project2D(point) {
        point.screen.x = SCREEN_CENTERX;
        point.screen.y = SCREEN_HEIGHT - point.world.z;
        point.screen.w = this.roadWidth;
    }


    /**
     * Renders the road (pseudo 3D view)
     */
    render3D() {
        this.graphics.clear();

        // get current and previous segments
        var currSegment = this.segments[1];
        var prevSegment = this.segments[0];

        // get the camera
        var camera = this.scene.camera;

        this.project3D(currSegment.point, camera);
        this.project3D(prevSegment.point, camera);

        var p1 = prevSegment.point.screen;
        var p2 = currSegment.point.screen;

        this.drawSegment(p1, p2, currSegment.color);

        // console.log("Previous segment: ", p1);
        // console.log("Current segment: ", p2);
    }
    /***
     * Projects a point from game position, to camera position, to screen position
     */
    project3D(point, camera) {

        // translating world coord to camera coord
        var transX = point.world.x - camera.x;
        var transY = point.world.y - camera.y;
        var transZ = point.world.z - camera.z;

        // scaling factor based on the law of similar triangles
        // console.log("Depth: ", camera.distToPlane, " TransZ: ", transZ);
        point.scale = camera.distToPlane / transZ;

        // projecting camera coordinates onto a normalized projection plane
        var projectedX = point.scale * transX;
        var projectedY = point.scale * transY;
        var projectedW = point.scale * this.roadWidth;

        // scaling projected coord to the screen coord
        point.screen.x = Math.round((1 + projectedX) * SCREEN_CENTERX);
        point.screen.y = Math.round((1 - projectedY) * SCREEN_CENTERY);
        point.screen.w = Math.round(projectedW * SCREEN_CENTERX);

    }

    drawSegment(p1, p2, color) {
        // x,y is in the center
        this.drawPolygon(p1.x - p1.w, p1.y, p1.x + p1.w, p1.y, p2.x + p2.w, p2.y, p2.x - p2.w, p2.y, color.road);
    }

    drawPolygon(x1, y1, x2, y2, x3, y3, x4, y4, color) {
        // console.log('draw');
        // x1,y1 - bottom left
        // x2,y2 - bottom right
        // x3,y3 - top right
        // x4,y4 - top left
        this.graphics.fillStyle(color, 1);
        this.graphics.beginPath();

        this.graphics.moveTo(x1, y1);
        this.graphics.lineTo(x2, y2);
        this.graphics.lineTo(x3, y3);
        this.graphics.lineTo(x4, y4);

        this.graphics.closePath();
        this.graphics.fill();

    }
}