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
// width of pull rectangle viz
var pullWidth = W/40;

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
    var headHeight = H / 15;
    var headRadius = headHeight / 3
    circle(W / 2, groundY - headHeight, headRadius);
    // The arms
    var handsWidth = W/25;
    var plexusY = groundY - headHeight * 2 /3;
    line(W / 2 - handsWidth, groundY - headHeight - headRadius,
         W / 2, plexusY);
    line(W / 2 + handsWidth, groundY - headHeight - headRadius,
         W / 2, plexusY);
    // The body
    line(W / 2, groundY - headHeight + headRadius, W / 2, groundY);
}

function draw() {
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
    if (keyIsDown(LEFT_ARROW))  alert("L");
    if (keyIsDown(RIGHT_ARROW)) alert("R");
    fill(255, 255, 0);
    rect(0, 0, pullWidth, (1-pullL)*H);
    rect(W-pullWidth, 0, W, (1-pullR)*H);
}
