// Screen size
var W, H;
if (window.location.hostname == '127.0.0.1') {
    W = 640;
    H = 480;
} else {
    W = window.screen.availWidth;
    H = window.screen.availHeight;
}
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
// width of pull rectangle viz
var pullWidth = W/40;
// The kite
var kiteX = W/2;
var kiteY = H/2;
var kiteW = W/30;
var kiteH = H/20;
var kiteBodyFactor = 2/3;
var kiteDir = 0;
var kiteSens = 0.1;

function setup() {
    createCanvas(W, H);
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
    // redraw
    fill(0, 0, 255);
    strokeWeight(0);
    rect(pullWidth, 0, W - 2*pullWidth, groundY - headHeight - headRadius);
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
    kiteDir += kiteSens * (pullR - pullL);
    // The kite
    fill(255, 255, 0);
    push();
    translate(kiteX, kiteY);
    rotate(kiteDir);
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
