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
    //player = null,
    // block =  new Array(),
    gameOver = true,    
    snakeBody =  new Array(),
    iSnakeBody= new Image(),
    aEatfruit = new Audio(),
    aEatSuperfruit = new Audio(),
    aChangeDirection = new Audio(),
    aGameOver = new Audio(),
    ifruit= new Image();
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
    //starts no head no body
    snakeBody.length = 0;
    //adding head and body
    snakeBody.push(new rectangle(100, 100, 10, 10));
    snakeBody.push(new rectangle(90, 100, 10, 10));
    snakeBody.push(new rectangle(80, 100, 10, 10));
    snakeBody.push(new rectangle(70, 100, 10, 10));
    snakeBody.push(new rectangle(60, 100, 10, 10));
    snakeBody.push(new rectangle(50, 100, 10, 10));
    snakeBody.push(new rectangle(40, 100, 10, 10));
    snakeBody.push(new rectangle(30, 100, 10, 10));
    snakeBody.push(new rectangle(20, 100, 10, 10));
    snakeBody.push(new rectangle(10, 100, 10, 10));
    snakeBody.push(new rectangle(0, 100, 10, 10));      
    fruit.x  = randomizer(canvas.width/10 -1)*10;
    fruit.y  = randomizer(canvas.height/10 -1)*10;
    gameOver = false;      
} 
// drawing of elements
function paint(ctx) {
    // re doing the canvas
    ctx.fillStyle = '#ddd';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    //drawing the naske's body 
     ctx.fillStyle = 'yellow'
    for (j = 1; j < snakeBody.length; j++) {
        //  snakeBody[j].fill(ctx);
        ctx.drawImage(iSnakeBody, snakeBody[j].x, snakeBody[j].y);
    }
    //first fruit
    // ctx.fillStyle = 'green';
    // fruit.fill(ctx);
    ctx.drawImage(ifruit, fruit.x, fruit.y);
    //show killer blocks
    // ctx.fillStyle = 'red';
    // for (x = 0; x < block.length; x++) {
    //     block[x].fill(ctx);
    // }
    //scoring sum
    ctx.fillText('Scores: ' + scoring, 5, 15);
    //showing pause or g over status
    if (pause) {
        ctx.fillStyle = 'blue';
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
    if (!pause) {
        //Reset the game once Game Over is true.
        if (gameOver){
            resetGame();            
        }
        //after the head is drawn the movement starts
        for (j = snakeBody.length-1; j > 0 ; j--) {
            snakeBody[j].x = snakeBody[j - 1].x;
            snakeBody[j].y = snakeBody[j - 1].y;
        }
        // directions
        if (lastPressed == keyUp && direction != 2) {
            direction = 0;
        } 
        if (lastPressed == keyRight && direction != 3) {
            direction = 1;
        } 
         if (lastPressed == keyDown && direction != 0) {
            direction = 2;
        } 
        if (lastPressed == keyLeft && direction != 1) {
            direction = 3;
        }
        // movement based on previous keystrokes adding imposibility to go in reverse
        if (direction == 0) {
            snakeBody[0].y -= 10;
        } 
        if (direction == 1) {
            snakeBody[0].x += 10;
        } 
        if (direction == 2) {
            snakeBody[0].y += 10;
        } 
         if (direction == 3) {
            snakeBody[0].x -=10;
        }
        // out of screen control taking into account snake head length when the snake hits the wall
        if (snakeBody[0].x > (canvas.width - snakeBody[0].width)) {
            snakeBody[0].x = 0;
        }
        if (snakeBody[0].x < 0) {
            snakeBody[0].x = (canvas.width - snakeBody[0].width);
        } 
        if (snakeBody[0].y > (canvas.height - snakeBody[0].height)) {
            snakeBody[0].y = 0;
        }
        if (snakeBody[0].y < 0) {
            snakeBody[0].y = (canvas.height - snakeBody[0].height);
        }
        // fruit-snake intersection control        
        if (snakeBody[0].intersects(fruit)) {
            snakeBody.push(new rectangle(fruit.x, fruit.y, 10, 10));
            scoring += 1;
            fruit.x  = randomizer(canvas.width/10 -1)*10;
            fruit.y  = randomizer(canvas.height/10 -1)*10;
            aEatfruit.play();
        }
        // touching owns body control starts with 2 because the firs one can never do it
        for (j = 2; j < snakeBody.length-1; j++) {
            if(snakeBody[0].intersects(snakeBody[j])) {                
                gameOver = true;
                pause = true;
                aGameOver.play();
            }
        }        
        //control fruit not touching blocks and add pause if player touches a block
        //  for (j = 0; j < block.length; j++) {
        //     if (fruit.intersects(block[j])) {
        //         fruit.x  = randomizer(canvas.width/10 -1)*10;
        //         fruit.y  = randomizer(canvas.height/10 -1)*10;
        //      }
        //      if (snakeBody[0].intersects(block[j])) {
        //         gameOver = true;
        //         pause = true;                
        //      }
        //  }
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
    //canvas and context
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    //player creation with a new object of the rectangle class
    player = new rectangle(100, 100, 10, 10);
    //regular fruit
    fruit = new rectangle(60, 60, 10, 10);
    //get media assests
    iSnakeBody.src = 'assets/body-piece.png'
    ifruit.src = 'assets/fruit.png'
    //media sounds
    aEatfruit.src =  'assets/chomp.oga'
    aGameOver.src = 'assets/dies.oga'
    //  killer blocks
    // block.push(new rectangle(120, 70, 10, 10));
    // block.push(new rectangle(370, 70, 10, 10));
    // block.push(new rectangle(120, 120, 10, 10));
    // block.push(new rectangle(370, 120, 10, 10));
    run();
    repaint();
}
window.addEventListener('load', init, false);