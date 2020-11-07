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
    scoring= 0,
    block =  new Array(),
    gameOver = true,
    player = null;
    
    
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

// function for the rectangle class and intersection of elements
function rectangle(x, y, width, height) {
    this.x = (x == null) ? 0 : x;
    this.y = (y == null) ? 0 : y;
    this.width = (width == null) ? 0 : width;
    this.height = (height == null) ? this.width : height;
    this.intersects = function (rect) {
        if (rect == null) {
            window.console.warn('Missing parameters on function intersects');
        } else {
        return (this.x < rect.x + rect.width &&
            this.x + this.width > rect.x &&
            this.y < rect.y + rect.height &&
            this.y + this.height > rect.y);
        }
    };
    this.fill = function (ctx) {
        if (ctx == null) {
            window.console.warn('Missing parameters on function fill');
    }    else {
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    };
}
// Randomizer for the fruit coordinates
function randomizer(n) {
    return Math.floor(Math.random()*n);
}  

//reset game, scores, directions and snake head position and first fruit
function resetGame () {
    scoring = 0;
    direction = 1;
    player.x = 100;
    player.y = 100;
    fruit.x  = randomizer(canvas.width/10 -1)*10;
    fruit.y  = randomizer(canvas.height/10 -1)*10;
    gameOver = false;
      
} 
// drawing of elements
function paint(ctx) {
    // re doing the canvas
    ctx.fillStyle = '#ddd';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    //first square 
    ctx.fillStyle = 'yellow';
    player.fill(ctx);
    //first fruit
    ctx.fillStyle = 'green';
    fruit.fill(ctx);
    console.log (lastPressed);
    // Showing pause on screen
   
    //show killer blocks
    ctx.fillStyle = 'red';
    for (x = 0; x < block.length; x++) {
        block[x].fill(ctx);
    }
    //scoring sum
    ctx.fillText('Scores: ' + scoring, 5, 15);
    if (pause) {
        ctx.textAlling = 'center';
        if (gameOver) {
            ctx.fillText('Game Over', 200, 100);
        } else {
            ctx.fillText('pause', 200, 100);
        }  
    }
}
//actions automatic movement starting after pause is false

function act() {
    var x;
    if (!pause) {
        //Reset the game once Game Over is true.
        if (gameOver){
            resetGame();            
        }
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
            player.y -= 10;
        } 
        if (direction == 1) {
            player.x += 10;
        } 
        if (direction == 2) {
            player.y += 10;
        } 
         if (direction == 3) {
            player.x -=10;
        }
        // out of screen control 
        if (player.x > canvas.width) {
            player.x = 0;
        }
        if (player.x < 0) {
            player.x = canvas.width;
        } 
        if (player.y > canvas.height) {
            player.y = 0;
        }
        if (player.y < 0) {
            player.y = canvas.height;
        }
        // fruit-snake intersection control
        if(player.intersects(fruit)) {
            scoring += 1;
            fruit.x  = randomizer(canvas.width/10 -1)*10;
            fruit.y  = randomizer(canvas.height/10 -1)*10;
        } 
        //control fruit not touching blocks and add pause if player touches a block
         for (x = 0; x < block.length; x++) {
            if (fruit.intersects(block[x])) {
                fruit.x  = randomizer(canvas.width/10 -1)*10;
                fruit.y  = randomizer(canvas.height/10 -1)*10;
             }
             if (player.intersects(block[x])) {
                gameOver = true;
                pause = true;                
             }
         }
    }
    // pause toggle
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
    //player creation with a new object of the rectangle class
    player = new rectangle(100, 100, 10, 10);
    //regular fruit
    fruit = new rectangle(60, 60, 10, 10);
    //  killer blocks
    block.push(new rectangle(120, 70, 10, 10));
    block.push(new rectangle(370, 70, 10, 10));
    block.push(new rectangle(120, 120, 10, 10));
    block.push(new rectangle(370, 120, 10, 10));
    run();
    repaint();
}
window.addEventListener('load', init, false);

