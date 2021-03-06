var cnv;

function centerCanvas() {
    cnv.position((windowWidth - width) / 2, (windowHeight - height) / 2);
}

// Screen size
var W, H;
if (window.location.hostname == '127.0.0.1') {
    W = 640;
    H = 480;
} else {
    W = 0.9 * window.screen.availWidth;
    H = 0.9 * window.screen.availHeight;
}
var screenFactor = Math.max(W/640, H/480);
var groundHeight = H/10;
var groundY = H - groundHeight;

// Pulling force, left and right
var pullL = 0;
var pullR = 0;
var pullAction = 0.04;
var pullRelease = 0.04;
// The kiter
var headHeight = H / 15;
var headRadius = headHeight / 3
var handsWidth = W/25;
var plexusY = groundY - headHeight * 2 /3;
var handsY = groundY - headHeight - headRadius;
// for the flying algorithm
var squareMaxDistance = Math.pow(Math.min(W/2, handsY), 2);
// width of pull rectangle viz
var pullWidth = W/40;
// The kite
var kiteXorig = W/2;
var kiteYorig = H/4;
var kiteX = kiteXorig;
var kiteY = kiteYorig;
var kiteW = W/30;
var kiteH = H/20;
var kiteBodyFactor = 2/3;
var kiteDir = 0;
var kiteSens = 0.1;
var windSpeed = 4 * screenFactor;
var kiteSpeed = 3 * screenFactor;

var elem = document.documentElement;
if (elem.requestFullscreen) {
    elem.requestFullscreen();
} else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
} else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
}

function setup() {
    cnv = createCanvas(W, H);
    centerCanvas();
    // The sky
    background(0, 0, 255);
    // The ground
    fill(0, 255, 0);
    rect(0, groundY, W, groundHeight);
    // The kiter
    fill(255, 0, 0);
    // The head
    circle(W / 2, groundY - headHeight, headRadius);
    // The arms
    line(W / 2 - handsWidth, handsY, W / 2, plexusY);
    line(W / 2 + handsWidth, handsY, W / 2, plexusY);
    // The body
    line(W / 2, groundY - headHeight + headRadius, W / 2, groundY);
}

function draw() {
    strokeWeight(1);
    // controls
    if (touches.length == 2) {
        var x1 = touches[0].x;
        var y1 = touches[0].y;
        var x2 = touches[1].x;
        var y2 = touches[1].y;
        if (x1 < x2) {
            pullL = y1/H;
            pullR = y2/H;
        } else {
            pullL = y2/H;
            pullR = y1/H;
        }
    }

    var e = 0.05;
    if (keyIsDown(LEFT_ARROW)) {
        if (pullL <= 1 - pullAction) {
            pullL += pullAction;
        }
        if (pullL > 1-e) pullL = 1;
    } else {
        if (pullL >= pullRelease) {
            pullL -= pullRelease;
        }
        if (pullL < e) pullL = 0;
    }
    if (keyIsDown(RIGHT_ARROW)) {
        if (pullR <= 1 - pullAction) {
            pullR += pullAction;
        }
        if (pullR > 1-e) pullR = 1;
    } else {
        if (pullR >= pullRelease) {
            pullR -= pullRelease;
        }
        if (pullR < e) pullR = 0;
    }
    if (!keyIsDown(UP_ARROW)) {
        blueSky();
    }
    // Kite moves
    kiteDir += kiteSens * (pullL - pullR);
    var squareDistance = Math.pow(W/2 - kiteX, 2) +
                         Math.pow(handsY - kiteY, 2);
    var posFactor = windSpeed * (1 - squareDistance / squareMaxDistance);
    var angleFromKitePos = Math.atan((W/2 - kiteX)/(handsY - kiteY));
    var relativeDir = kiteDir - angleFromKitePos;
    var dirFactor = fixDirFactor(kiteSpeed * Math.abs(Math.sin(relativeDir/2)));
    var finalFactor = Math.max(posFactor, Math.pow(dirFactor, 2));
    kiteX -= finalFactor * Math.sin(kiteDir);
    kiteY -= finalFactor * Math.cos(kiteDir);
    if (kiteY > handsY - max(kiteW, kiteH)) {  // CRASH !!!
        kiteX = kiteXorig;
        kiteY = kiteYorig;
        kiteDir = 0;
        blueSky();
    }
    // The kite
    fill(255, 255, 0);
    push();
    translate(kiteX, kiteY);
    rotate(-kiteDir);
    kite();
    pop();
    // The pull viz rectangles
    strokeWeight(0);
    rect(0, 0, pullWidth, pullL*groundY);
    rect(W-pullWidth, 0, pullWidth, pullR*groundY);
    fill(0, 0, 255);
    rect(0, pullL*groundY, pullWidth, (1-pullL)*groundY);
    rect(W-pullWidth, pullR*groundY, pullWidth, (1-pullR)*groundY);
    strokeWeight(1);
}

function kite() {
    beginShape();
    vertex(0, -kiteH / 2);
    vertex(-kiteW, -kiteH/2+kiteBodyFactor*kiteH);
    vertex(0,  kiteH / 2);
    vertex( kiteW, -kiteH/2+kiteBodyFactor*kiteH);
    endShape(CLOSE);
}

function blueSky() {
    fill(0, 0, 255);
    strokeWeight(0);
    rect(pullWidth, 0, W - 2*pullWidth, groundY - headHeight - headRadius);
}

function fixDirFactor(x) {
    return Math.min(Math.pow(x, 1.5), Math.pow(x, 0.7));
}

function windowResized() {
    centerCanvas();
}
