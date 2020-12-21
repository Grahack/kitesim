// Screen size
var W, H;
// Pulling force, left and right
var pullL, pullR;

if (window.location.hostname == '127.0.0.1') {
    W = 640;
    H = 480;
} else {
    W = window.screen.availWidth;
    H = window.screen.availHeight;
}

function setup() {
    createCanvas(W, H);
    // The sky
    background(0, 0, 255);
    // The ground
    fill(0, 255, 0);
    var groundHeight = H/10;
    var groundY = H - groundHeight;
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
        alert(touches[0] + ':' + touches[1]);
    }
    if (keyIsDown(LEFT_ARROW))  alert("L");
    if (keyIsDown(RIGHT_ARROW)) alert("R");
}
