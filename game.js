/**
 * Created by Anton Goi on 30.11.2014.
 */

window.onload = init;

var gameSpace;
var ctxGameSpace;

var bricks;
var bricksMatrix;
var rocket;
var ball;

function init() {
    gameSpace = document.getElementById("gameSpace");

    bricksMatrix = new BrickMatrix();
    bricks=bricksMatrix.bricks;
    for (var i = 0; i < bricks.length; i++) {
        var brick = bricks[i];
        var div = document.createElement("div");
        div.style.top = -40 * brick.x - 360 * brick.y + "px";
        div.style.left = brick.x * 100 + "px";
        div.className = "brickSimple";
        div.id = "brick_" + i;
        gameSpace.appendChild(div);

        brick.DOMlink = div;
    }

    $("#win").hide();
    $("#gameover").hide();

    rocket = new Rocket();
    ball = new Ball();
    rocket.bindBall(ball);

    document.addEventListener("mousemove", mouseMoveListener_gameSpace, false);
    document.addEventListener("click", clickListener, false);
}


function Rocket() {
    this.x = 300;
    this.y = 590;

    this.DOMlink = document.getElementById("rocket");

    this.bindedBall = null;

    this.setCoords = function (x, y) {
        if (this.bindedBall == null) {
            this.x = x;
            this.y = y;
        }
        else {
            this.bindedBall.x = this.bindedBall.x - this.x + x;
            this.bindedBall.y = this.bindedBall.y - this.y + y;
            this.x = x;
            this.y = y;
        }
    }
    this.setX = function (x) {
        this.setCoords(x, this.y);
    }
    this.setY = function (y) {
        this.setCoords(this.x, y);
    }
    this.render = function () {
        this.DOMlink.style.left = this.x + "px";
        this.DOMlink.style.top = this.y + "px";
        if (this.bindedBall != null) this.bindedBall.render();
    }
    this.bindBall = function (ball) {
        this.bindedBall = ball;
    }

    this.unbindBall = function () {
        this.bindedBall = null;
    }
}

function Brick(x, y) {
    this.x = x;
    this.y = y;
    this.visible = true;
    this.bonus = null;

    this.DOMlink = null;

    this.hasBonus = function () {
        if (this.bonus == null) return false; else return true;
    }
    this.getBonus = function () {
        return this.bonus;
    }

    this.hide = function () {
        this.visible = false;
        this.DOMlink.style.visibility = "hidden";
        bricksMatrix.points++;
        if(bricksMatrix.points==bricksMatrix.length()) youWin();
    }

    this.checkCollision = function (ball) {
        var ax = $(this.DOMlink).offset().left;
        var ay = $(this.DOMlink).offset().top;
        var bx = ax+100;
        var cx = bx;
        var dx = ax;
        var by = ay;
        var cy = ay+40;
        var dy = cy;

        var ball_ax = ball.x+8;
        var ball_ay = ball.y;
        var ball_bx= ball_ax+16;
        var ball_by= ball_ay+8;
        var ball_cx= ball_ax+8;
        var ball_cy= ball_ay+16;
        var ball_dx= ball_ax;
        var ball_dy= ball_ay+8;

        if((ball_ax>=ax)&&(ball_ax<=bx)&&(ball_ay>=ay)&&(ball_ay<=dy))
            return [true, 't'];
        if((ball_bx>=ax)&&(ball_bx<=bx)&&(ball_by>=ay)&&(ball_by<=dy))
            return [true, 'r'];
        if((ball_cx>=ax)&&(ball_cx<=bx)&&(ball_cy>=ay)&&(ball_cy<=dy))
            return [true, 't'];
        if((ball_dx>=ax)&&(ball_dx<=bx)&&(ball_dy>=ay)&&(ball_dy<=dy))
            return [true, 'l'];

        return [false];

        if ((x < ball.x + 16) && (x + 100 > ball.x) && (y < ball.y + 16) && (y + 40 > ball.y))
            return [true, 't'];
        //return [true, 't'];
        return [false];
    }
}

function BrickMatrix() {
    this.bricks = [];
    for (var y = 0; y < 3; y++)
        for (var x = 0; x < 10; x++) {
            this.bricks.push(new Brick(x, y));
        }

    this.length = function(){return this.bricks.length;}
    this.points = 0;
}

function Ball() {
    this.x = 367;
    this.y = 574;
    this.movingVectorX = 0;
    this.movingVectorY = 0;

    this.DOMlink = document.getElementById("ball");

    this.setMovingVector = function (x, y) {
        this.movingVectorX = x;
        this.movingVectorY = y;
    }
    this.getMovingVector = function () {
        return [this.movingVectorX, this.movingVectorY];
    }
    this.getStep = function () {
        var vect = this.getMovingVector();
        var x = vect[0];
        var y = vect[1];
        var dividor = 10;
        if (Math.abs(x) >= Math.abs(y)) dividor = Math.abs(x) / 5.0;
        else dividor = Math.abs(y) / 5.0;

        return [x / dividor, y / dividor];
    }

    this.addStep = function () {
        var step = this.getStep();
        this.x += step[0];
        this.y += step[1];
    }

    this.render = function () {
        this.DOMlink.style.top = this.y + "px";
        this.DOMlink.style.left = this.x + "px";
    }
}

function checkWallCollision(ball) {
    var aX = $(gameSpace).offset().left;
    var aY = $(gameSpace).offset().top;
    var bX = $(ball.DOMlink).offset().left;
    var bY = $(ball.DOMlink).offset().top;
    var aWidth = $(gameSpace).width();
    var bWidth = $(ball.DOMlink).width();
    var aHeight = $(gameSpace).height();
    var bHeight = $(ball.DOMlink).height();

    if (gameSpace = gameSpace)
        if (bX <= aX) {
            if (ball.getMovingVector()[1] < 0)
                return [true, 'l', 't'];
            else
                return [true, 'l', 'd'];
        }
    if (bY <= aY) {
        if (ball.getMovingVector()[0] < 0)
            return [true, 't', 'l'];
        else
            return [true, 't', 'r'];
    }
    if (bX + 16 >= aX + 1000) {
        if (ball.getMovingVector()[1] < 0)
            return [true, 'r', 't'];
        else
            return [true, 'r', 'd'];
    }
    if (bY >= aY + 570) {
        if (ball.getMovingVector()[1] > 0)
            return [true, 'd', 'l'];
        else
            return [true, 'd', 'r'];
    }

    return [false];
}

function getYforRocketReflection(x) {
    //return Math.pow((170.0 - Math.pow(x,2)),(1.0/2.5))-3.0;
    return Math.sqrt((5625.0 - Math.pow(x * 1, 2)));
}

function checkRocketCollision(ball) {
    var aX = $(rocket.DOMlink).offset().left;
    var aY = $(rocket.DOMlink).offset().top;
    var bX = $(ball.DOMlink).offset().left;
    var bY = $(ball.DOMlink).offset().top;
    var aWidth = $(rocket.DOMlink).width();
    var bWidth = $(ball.DOMlink).width();
    var aHeight = $(rocket.DOMlink).height();
    var bHeight = $(ball.DOMlink).height();

    if ((bY + 16 >= aY) && (bX + 16 > aX) && (bX < aX + 150)) {
        if (ball.getMovingVector()[1] > 0) {
            //console.log("! "+(bX)+" "+(590-getYforRocketReflection(bX-aX-67)));redr=function(){};
            return [true, 'rocket', bX, 590 - getYforRocketReflection(bX - aX - 67), aX + 75];
        }
    }
    return [false];
}

function reflect(ball, collision) {
    if (collision[1] == 'r') {
        ball.movingVectorX = -ball.movingVectorX;
    } else if (collision[1] == 'l') {
        ball.movingVectorX = -ball.movingVectorX;
    } else if (collision[1] == 't') {
        ball.movingVectorY = -ball.movingVectorY;
    } else if (collision[1] == 'rocket') {
        var x1 = $(ball.DOMlink).offset().left;
        var y1 = $(ball.DOMlink).offset().top;
        ball.movingVectorX = collision[2] - collision[4];
        ball.movingVectorY = collision[3] - 590;
        //ball.x=collision[2];
        //ball.y=collision[3];
        //ball.render();
        //redr=function(){}
    } else if (collision[1] == 'd') {
        gameOver();
    }
}


var redr = function reDraw() {
    if((ball.x==NaN)||(ball.y==NaN)) {
        ball.x=$(ball.DOMlink).offset().left;
        ball.y=$(ball.DOMlink).offset().top;
    }
    if((ball.movingVectorX==NaN)||(ball.movingVectorY==NaN)) {
        ball.movingVectorX=0;
        ball.movingVectorY=-10;
    }
    ball.addStep();
    ball.render();
    var collision = checkWallCollision(ball);
    if (collision[0] == true) {
        console.log(collision);
        console.log(ball.getStep());
        reflect(ball, collision);
        console.log(ball.getStep());
        if(Math.abs(ball.movingVectorY)<1) ball.movingVectorY=1;
        //redr=function(){}
        return;
    }
    collision = checkRocketCollision(ball);
    if (collision[0] == true) {
        //console.log(collision);
        //console.log(ball.getStep());
        reflect(ball, collision);
        //console.log(ball.getStep());
        //redr=function(){}
        //return;
    }
    for (var i = 0; i < bricks.length; i++) {
        collision = bricks[i].checkCollision(ball);
        //console.log("brick  " + collision);
        if (collision[0] == true) {
            if (bricks[i].visible) {
                reflect(ball, collision);
                brickDestroyed();
                bricks[i].hide();
            }
        }
    }
}

var pointsCount=0;
function brickDestroyed() {
    pointsCount++;
    $('#points').html("points: "+pointsCount);
}

function youWin(){
    redr = function(){}
    $("#gameSpace").hide();
    $("#win").show();
    $(ball.DOMlink).hide();
}

function gameOver(){
    redr = function(){}
    $("#gameSpace").hide();
    $("#gameover").show();
    $(ball.DOMlink).hide();
}


function mouseMoveListener_gameSpace(e) {
    var mx = e.clientX || e.pageX;
    var gameSpaceX = $(gameSpace).offset().left;
    var rocketX = mx - 60;
    if (rocketX < gameSpaceX) rocketX = gameSpaceX;
    if (rocketX + 150 > gameSpaceX + 1000) rocketX = gameSpaceX + 850;
    rocket.setX(rocketX);
    rocket.render();
}

var playing = false;
function clickListener(e) {
    if (!playing) {
        rocket.unbindBall();
        ball.x = $(ball.DOMlink).offset().left;
        ball.y = $(ball.DOMlink).offset().top;
        console.log(ball.x + " " + ball.y);
        ball.movingVectorX = 0;
        ball.movingVectorY = -10;
        console.log(ball.movingVectorX + " " + ball.movingVectorY);
        setInterval("redr()", 15);
        playing = true;
    }
}
