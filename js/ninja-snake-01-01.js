var canvas = null,
    pause = true,
    ctx = null,    
    lastPressed = null,
    keyEnter=13,
    keyLeft = 37,
    keyUp = 38,
    keyRight = 39,
    keyDown = 40,
    direction = 0,
    x = 30,
    y = 60;
// for older browsers
window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    function (callback) {
    window.setTimeout(callback, 17);
    };
} () );
// listener for keypressed
document.addEventListener('keydown', function (e) {
    lastPressed = e.which;
    }, false);
// drawing of elements
function paint(ctx) {
    // re doing the canvas
    ctx.fillStyle = '#ddd';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    //first square 
    ctx.fillStyle = 'blue';
    ctx.fillRect(x, y, 10, 10);
    // console.log (lastPressed);
    // Showing pause on screen
    if (pause) {
        ctx.textAlling = 'center';
        ctx.fillText('Game is Paused', 200, 100);
    }
}
//actions automatic movement starting after pause is false
function act() {
    if (!pause) {
        // directions
        if (lastPressed == keyUp) {
            direction = 0;
        } 
        if (lastPressed == keyRight) {
            direction = 1;
        } 
         if (lastPressed == keyDown) {
            direction = 2;
        } 
        if (lastPressed == keyLeft) {
            direction = 3;
        }
        // movement based on previous keystrokes
        if (direction == 0) {
            y -= 10;
        } 
        if (direction == 1) {
            x += 10;
        } 
        if (direction == 2) {
            y += 10;
        } 
         if (direction == 3) {
            x -=10;
        }
        // out of screen control 
        if (x > canvas.width) {
            x = 0;
        }
        if (x < 0) {
            x = canvas.width;
        } 
        if (y > canvas.height) {
            y = 0;
        }
        if (y < 0) {
            y = canvas.height;
        }
    }
    // pause toogle
    if (lastPressed == keyEnter) {
        pause = !pause;
        lastPressed = null;
    }
}
//added repaint and modified run
function repaint() {
    window.requestAnimationFrame(repaint);
    paint(ctx);
}
function run() {
    setTimeout(run, 50);
    act();
}
// now init calls run
function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');    
    run();
    repaint();
}
window.addEventListener('load', init, false);