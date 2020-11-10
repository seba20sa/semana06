/*jslint bitwise:true, es5: true */
(function (window, undefined) {
    'use strict';
    var KEY_ENTER = 13,
        KEY_LEFT = 37,
        KEY_UP = 38,
        KEY_RIGHT = 39,
        KEY_DOWN = 40,
        dir = 0,
        lastPress = null,
        //context
        canvas = null,
        ctx = null,
        // fullscreen = false,                
        // game status
        pause = false,
        gameover = false,
        currentScene = 0,
        scenes = [],
        mainScene = null,
        gameScene = null,
        highscoresScene = null,
        // game elements
        banana = null,
        body = [],
        food = null,
        //var wall = [],
        //scoring
        highscores = [],
        posHighscore = 10,
        score = 0,
        // media
        iBanana = new Image(),        
        iBody = new Image(),
        iFood = new Image(),
        // aCena = new Audio(),
        aEat = new Audio(),
        aDie = new Audio();
        // randomizer for food and banana
        var chances = ~~(Math.random()*100);
    //added correction on return
    window.requestAnimationFrame = (function () {
        return (
            window.requestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 17);
            }
        );
    })();
    document.addEventListener('keydown', function (evt) {
        if (evt.which >= 37 && evt.which <= 40) {
            evt.preventDefault();
        }
        lastPress = evt.which;
    }, false);
    // define Rectangle changed null by undefined 
    function Rectangle(x, y, width, height) {
        this.x = x === undefined ? 0 : x;
        this.y = y === undefined ? 0 : y;
        this.width = width === undefined ? 0 : width;
        this.height = height === undefined ? this.width : height;
    }
    //defined prototype for the rectangle class
    Rectangle.prototype = {
        constructor: Rectangle,
        intersects: function (rect) {
            if (rect === undefined) {
                window.console.warn('Missing parameters on function intersects');
            } else {
                return (
                    this.x < rect.x + rect.width &&
                    this.x + this.width > rect.x &&
                    this.y < rect.y + rect.height &&
                    this.y + this.height > rect.y
                    );
            }
        },
        fill: function (ctx) {
                if (ctx === undefined) {
                    window.console.warn('Missing parameters on function fill');
                } else {
                    ctx.fillRect(this.x, this.y, this.width, this.height);
                }
        },
        drawImage: function (ctx, img) {
            if (img === undefined) {
                window.console.warn('Missing parameters on function drawImage');
            } else {
                if (img.width) {
                    ctx.drawImage(img, this.x, this.y);
                } else {
                    ctx.strokeRect(this.x, this.y, this.width, this.height);
                }
            }
        }
    };
    function Scene() {
        this.id = scenes.length;
        scenes.push(this);
    }
    Scene.prototype = {
        constructor: Scene,
        load: function () {},
        paint: function (ctx) {},
        act: function () {},
    };
    function loadScene(scene) {
        currentScene = scene.id;
        scenes[currentScene].load();
    }
    //randomizer
    function random(max) {
        return ~~(Math.random() * max);
    }
    //audio compatibility added audios in format m4a for alternative browsers
    function canPlayOgg() {
		var aud = new Audio();
		if (aud.canPlayType('audio/ogg').replace(/no/, '')) {
			return true;
		} else {
		    return false;
		}
	};
    function resize() {
		var w = window.innerWidth / canvas.width;
		var h = window.innerHeight / canvas.height;
		var scale = Math.min(h, w);
		canvas.style.width = (canvas.width * scale) + 'px';
		canvas.style.height = (canvas.height * scale) + 'px';
	}
	window.addEventListener('resize', resize, false);
    function addHighscore(score) {
        var i;
        posHighscore = 0;
        while (
            highscores[posHighscore] > score && posHighscore < highscores.length) {
                posHighscore += 1;
            }
            highscores.splice(posHighscore, 0, score);
            if (highscores.length > 10) {
                highscores.length = 10;
            }
            localStorage.highscores = highscores.join(',');
    }    
    function repaint() {
        window.requestAnimationFrame(repaint);
        if (scenes.length) {
            scenes[currentScene].paint(ctx);
        }
    }
    function run() {
        setTimeout(run, 50);
        if (scenes.length) {
            scenes[currentScene].act();
        }
    }
    function init() {     
        // console.log(chances);
        // Get canvas and context
        canvas = document.getElementById('canvas');
        ctx = canvas.getContext('2d');
        // Load assets audio compatible for chrome
        iBanana.src = 'assets/banana.png';
        iBody.src = 'assets/body.png';
        iFood.src = 'assets/fruit.png';        
        if (canPlayOgg()) {
			aEat.src="assets/chomp.oga";
            aDie.src = 'assets/dies.ogg';
            // aCena.src = 'assets/cena.ogg';
        } else {
			aEat.src="assets/chomp.m4a";
            aDie.src = 'assets/dies.m4a';
            // aCena.src = 'assets/cena.m4a';            
		}
        // Create food        
        food = new Rectangle(80, 80, 10, 10);
        // create banana 
        banana = new Rectangle (80, 80, 10, 10);        
        // Load saved highscores
        if (localStorage.highscores) {
            highscores = localStorage.highscores.split(',');
        }
        // Start game
        run();
        repaint();
    }
    // Main Scene
    mainScene = new Scene();
    mainScene.paint = function (ctx) {
        // Clean canvas
        ctx.fillStyle = '#ddd';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Draw title
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText('WELCOME TO SNAKE', 150, 60);
        ctx.fillText('Press Enter', 150, 90);
        // aCena.play();
    };
    mainScene.act = function () {
        // Load next scene
        if (lastPress === KEY_ENTER) {
            loadScene(highscoresScene);
            lastPress = null;
            
        }
    };
    // Game Scene
    gameScene = new Scene();
    gameScene.load = function () {
        score = 0;
        dir = 1;
        body.length = 0;
        //added more difficulty 
        body.push(new Rectangle(40, 40, 10, 10));
        body.push(new Rectangle(0, 0, 10, 10));
        body.push(new Rectangle(0, 0, 10, 10));
        body.push(new Rectangle(0, 0, 10, 10));
        body.push(new Rectangle(0, 0, 10, 10));
        body.push(new Rectangle(0, 0, 10, 10));
        body.push(new Rectangle(0, 0, 10, 10));
        body.push(new Rectangle(0, 0, 10, 10));            
        body.push(new Rectangle(0, 0, 10, 10));  
        //first food
        food.x = random(canvas.width / 10 - 1) * 10;
        food.y = random(canvas.height / 10 - 1) * 10;
        //banana
        banana.x = random(canvas.width / 10 - 1) * 10;
        banana.y = random(canvas.height / 10 - 1) * 10;
        //game status
        gameover = false;
    };
    gameScene.paint = function (ctx) {
        var i = 0,
        l = 0;
        // Clean canvas
        ctx.fillStyle = '#ddd';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Draw player
        ctx.strokeStyle = 'green';
        for (i = 0, l = body.length; i < l; i += 1) {
            body[i].drawImage(ctx, iBody);
        }
        // Draw walls with the older code needs to be converted to work    
        //ctx.fillStyle = '#999';
        //for (i = 0, l = wall.length; i < l; i += 1) {
        // wall[i].fill(ctx);
        //}
        // one in three chances of banana
        if (chances <= 30 ) {
            //draw banana
            ctx.strokeStyle = 'yellow';
            banana.drawImage(ctx, iBanana);
        } else {
            // Draw food
            ctx.strokeStyle = 'blue';
            food.drawImage(ctx, iFood);
        }
        // Draw score
        ctx.fillStyle = 'white';
        ctx.textAlign = 'left';
        ctx.fillText('Score: ' + score, 0, 10);
        // Draw pause
        if (pause) {
            ctx.textAlign = 'center';
            if (gameover) {
                ctx.fillText('GAME OVER', 150, 75);
            } else {
                ctx.fillText('PAUSE', 150, 75);
            }
        }
    };
    gameScene.act = function () {
        var i = 0,
            l = 0;
        if (!pause) {
            // GameOver Reset
            if (gameover) {
                loadScene(highscoresScene);
            }
            // Move Body
            for (i = body.length - 1; i > 0; i -= 1) {
                body[i].x = body[i - 1].x;
                body[i].y = body[i - 1].y;
            }
            // Change Direction
            if (lastPress === KEY_UP && dir !== 2) {
                dir = 0;
            }
            if (lastPress === KEY_RIGHT && dir !== 3) {
                dir = 1;
            }
            if (lastPress === KEY_DOWN && dir !== 0) {
                dir = 2;
            }
            if (lastPress === KEY_LEFT && dir !== 1) {
                dir = 3;
            }
            // Move Head
            if (dir === 0) {
                body[0].y -= 10;
            }
            if (dir === 1) {
                body[0].x += 10;
            }
            if (dir === 2) {
                body[0].y += 10;
            }
            if (dir === 3) {
                body[0].x -= 10;
            }
            // Out Screen control
            if (body[0].x > canvas.width - body[0].width) {
                body[0].x = 0;
            }
            if (body[0].y > canvas.height - body[0].height) {
                body[0].y = 0;
            }
            if (body[0].x < 0) {
                body[0].x = canvas.width - body[0].width;
            }
            if (body[0].y < 0) {
                body[0].y = canvas.height - body[0].height;
            }
            // if food or banana appears where the body is it should be re draw
            // for (i = 2; i < body.length; i++) {
            //     if(body[i].intersects(food)) {
            //         food.x = random(canvas.width / 10 - 1) * 10;
            //         food.y = random(canvas.height / 10 - 1) * 10;
            //     }
            //     if(body[i].intersects(banana)) {
            //         banana.x = random(canvas.width / 10 - 1) * 10;
            //         banana.y = random(canvas.height / 10 - 1) * 10;
            //     }
            // }
            // Food Intersects
            if (body[0].intersects(food)) {                
                body.push(new Rectangle(0, 0, 10, 10));
                score += 1;
                food.x = random(canvas.width / 10 - 1) * 10;
                food.y = random(canvas.height / 10 - 1) * 10;                                
                chances = ~~(Math.random()*100);                
                aEat.play();
            }
            // banana Intersects modification of the snake size method
            if (body[0].intersects(banana)) {                
                score += 2;
                banana.x = random(canvas.width / 10 - 1) * 10;
                banana.y = random(canvas.height / 10 - 1) * 10;                
                chances = ~~(Math.random()*100);
                aEat.play();
                // each time the head intersects banana we try to updates the scores
                fetch(`https://jsonplaceholder.typicode.com/?score=${score}`)
                    .then(() => console.log('Score has been sent'))
                    .catch(() => console.log('Something went wrong'))
            }            
            // Wall Intersects (outdated code)
            //for (i = 0, l = wall.length; i < l; i += 1) {
            // if (food.intersects(wall[i])) {
            // food.x = random(canvas.width / 10 - 1) * 10;
            // food.y = random(canvas.height / 10 - 1) * 10;
            // }
            //
            // if (body[0].intersects(wall[i])) {
            // gameover = true;
            // pause = true;
            // }
            //}
            // Body Intersects itself
            for (i = 2, l = body.length; i < l; i += 1) {
                if (body[0].intersects(body[i])) {
                    gameover = true;
                    pause = true;
                    aDie.play();
                    addHighscore(score);
                }
            }
        }
        // Pause/Unpause
        if (lastPress === KEY_ENTER) {
            pause = !pause;
            lastPress = null;
        }
    };
    // Highscore Scene
    highscoresScene = new Scene();
    highscoresScene.paint = function (ctx) {
        var i = 0,
        l = 0;
        // Clean canvas
        ctx.fillStyle = '#ddd';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Draw title
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText('HIGH SCORES', 150, 30);
        // Draw high scores
        ctx.textAlign = 'right';
        for (i = 0, l = highscores.length; i < l; i += 1) {
            if (i === posHighscore) {
                ctx.fillText('*' + highscores[i], 180, 40 + i * 10);
            } else {
                ctx.fillText(highscores[i], 180, 40 + i * 10);
            }
        }
    };
    highscoresScene.act = function () {
        // Load next scene
        if (lastPress === KEY_ENTER) {
            loadScene(gameScene);
            lastPress = null;
        }
    };
    window.addEventListener('load', init, false);
}(window));