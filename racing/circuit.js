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

        // total n segments
        this.total_segments = null;

        // total road length
        self.roadLength = null;

        // number of visible segments to be drawn
        this.visible_segments = 200;

        // number of segments that forms a rumble strip - kerbs
        this.rumble_segments = 5;

        // number of lanes
        this.roadLanes = 3;

        // texture to draw sprites on it
        this.texture = scene.add.renderTexture(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }

    create() {
        // clear arrays
        this.segments = [];

        // create a road
        this.createRoad();

        // colorize start and finish segements
        for (let n = 0; n < this.rumble_segments; n++) {
            this.segments[n].color.road = '0xFFFFFF'; // start
            this.segments[this.segments.length - 1 - n].color.road = '0x222222'; // finish
        }

        this.total_segments = this.segments.length;

        // calculate road length
        this.roadLength = this.total_segments * this.segmentLength;
    }

    createRoad() {
        // there will be more segments later
        // each segment can be Straight/Curved, Uphill/Downhill/No Slope
        this.createSection(300);
    }

    createSection(nSegments) {
        for (let index = 0; index < nSegments; index++) {
            this.createSegment();
            // console.log("Created segment: ", index, " ", this.segments[index]);
        }
    }

    createSegment() {
        // each segment can be on the road, outside (grass) or kerbs
        // road - grey dark/light
        // grass - green dark/light
        // kerb - red/white
        const COLORS = {
            Light: { road: '0x888888', grass: '0x429352', rumble: '0xb8312e' },
            Dark: { road: '0x666666', grass: '0x397d46', rumble: '0xDDDDDD', lane: '0xFFFFFF' },
        }

        var n = this.segments.length;

        // add new segment
        this.segments.push({
            index: n,
            point: {
                world: { x: 0, y: 0, z: n * this.segmentLength }, // game position
                screen: { x: 0, y: 0, w: 0 }, // screen position
                scale: -1,
            },
            color: Math.floor(n / this.rumble_segments) % 2 ? COLORS.Dark : COLORS.Light,
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

    getSegment(positionZ) {
        // check if behind the player
        if (positionZ < 0) positionZ += this.roadLength;
        var index = Math.floor(positionZ / this.segmentLength) % this.total_segments;
        return this.segments[index];
    }


    /**
     * Renders the road (pseudo 3D view), segment by segment
     */
    render3D() {
        this.graphics.clear();

        // do not render segments below this limit
        var clipBottomLine = SCREEN_HEIGHT;

        // get the camera
        var camera = this.scene.camera;

        // get the base segment (segment where the camera is located)
        var baseSegment = this.getSegment(camera.z);
        var baseIndex = baseSegment.index;

        for (let n = 0; n < this.visible_segments; n++) {
            // get current segment
            var currIndex = (baseIndex + n) % this.total_segments;
            var currSegment = this.segments[currIndex];

            // get camera offset-Z to loop back the road
            var offsetZ = (currIndex < baseIndex) ? this.roadLength : 0;

            this.project3D(currSegment.point, camera, offsetZ);

            // draw this segment only if it is above clipping bottom line
            var currBottomLine = currSegment.point.screen.y;

            // skip the first segment because we still don't have prevSegment
            if (n > 0 && currBottomLine < clipBottomLine) {
                var prevIndex = (currIndex > 0) ? currIndex - 1 : this.total_segments - 1;
                var prevSegment = this.segments[prevIndex];

                var p1 = prevSegment.point.screen;
                var p2 = currSegment.point.screen;

                this.drawSegment(p1, p2, currSegment.color);

                // move clipping bottom line up
                clipBottomLine = currBottomLine;

                // console.log(prevIndex, currIndex, p1, p2);
                // console.log("Previous segment: ", p1);
                // console.log("Current segment: ", p2);
            }
        }

        // draw all visible objects on the rendering texture
        this.texture.clear();

        var player = this.scene.player;
        this.texture.draw(player.sprite, player.screen.x, player.screen.y);
    }
    /***
     * Projects a point from game position, to camera position, to screen position
     */
    project3D(point, camera, offsetZ) {

        // translating world coord to camera coord
        var transX = point.world.x - camera.x;
        var transY = point.world.y - camera.y;
        var transZ = point.world.z - camera.z - offsetZ;

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
        // p1 is bottom
        // p2 is top

        // x,y is in the center

        // draw grass filling all space
        this.graphics.fillStyle(color.grass, 1);
        this.graphics.fillRect(0, p2.y, SCREEN_WIDTH, p1.y - p2.y);

        // draw road segment on top of grass
        this.drawPolygon(
            p1.x - p1.w, p1.y, // bottom left
            p1.x + p1.w, p1.y, // bottom right
            p2.x + p2.w, p2.y, // top right
            p2.x - p2.w, p2.y, // top left
            color.road
        );

        // draw rumble strips - kerbs
        var rumble_w1 = p1.w / 5;
        var rumble_w2 = p2.w / 5;
        // left kerb
        this.drawPolygon(
            p1.x - p1.w - rumble_w1, p1.y, // bottom left
            p1.x - p1.w, p1.y, // bottom right
            p2.x - p2.w, p2.y, // top right
            p2.x - p2.w - rumble_w2, p2.y, // top left
            color.rumble
        );
        // right kerb
        this.drawPolygon(
            p1.x + p1.w + rumble_w1, p1.y, // bottom left
            p1.x + p1.w, p1.y, // bottom right
            p2.x + p2.w, p2.y, // top right
            p2.x + p2.w + rumble_w2, p2.y, // top left
            color.rumble
        );

        // draw lanes
        if (color.lane) {
            var line_w1 = (p1.w / 20) / 2;
            var line_w2 = (p2.w / 20) / 2;

            var lane_w1 = p1.w * 2 / this.roadLanes;
            var lane_w2 = p2.w * 2 / this.roadLanes;

            var lane_x1 = p1.x - p1.w;
            var lane_x2 = p2.x - p2.w;

            for (let i = 1; i < this.roadLanes; i++) {
                lane_x1 += lane_w1;
                lane_x2 += lane_w2;

                this.drawPolygon(
                    lane_x1 - line_w1, p1.y, // bottom left
                    lane_x1 + line_w1, p1.y, // bottom right
                    lane_x2 + line_w2, p2.y, // top right
                    lane_x2 - line_w2, p2.y, // top left
                    color.lane
                )
            }
        }
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