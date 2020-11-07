var canvas = null,
ctx = null,
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
}());
// drawing of elements
function paint(ctx) {
    ctx.fillStyle = '#ddd';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'blue';
    ctx.fillRect(x, y, 10, 10);
}
//actions automatic movement 
function act() {
    x += 2;
    if (x > canvas.width) {
    x = 0;
    }
}
function run() {
    window.requestAnimationFrame(run);
    act();
    paint(ctx);
}
// now init calls run
function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    run();
}
window.addEventListener('load', init, false);