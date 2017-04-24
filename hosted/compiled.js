"use strict";

var redraw = function redraw(time) {
  update();

  ctx.clearRect(0, 0, 1000, 1000);
};
'use strict';

var setUser = function setUser(data) {

  // if you are the new user, set your data
  if (!hash) {
    console.log('setting user');
    room = data.room;
    hash = data.hash;
    myNum = data.playerCount;
  }

  // everyone gets an update to say how many people are in the room
  ctx.clearRect(0, 0, 1000, 1000);
  ctx.strokeStyle = 'black';
  ctx.font = '20px serif';
  ctx.strokeText('Player Count: ' + data.playerCount + '/3', ctx.width / 2 - 200, ctx.height / 2);
};

var startGame = function startGame(data) {

  ctx.clearRect(0, 0, 1000, 1000);

  // allow the primary potato to start the game with hot potato in hand
  if (data.primaryPotato === myNum) {

    setTimeout(displayPotato, 3000);

    //    ctx.font = '48px serif';
    //    ctx.strokeText('Press Space to Start!', ctx.width/2 - 200, ctx.height/2);
  } else {
    ctx.strokeStyle = 'black';
    ctx.font = '20px serif';
    ctx.strokeText('Waiting for primary potato to pass...', ctx.width / 2 - 200, ctx.height / 2);
  }
};

// displays the potato with the letter
var displayPotato = function displayPotato() {

  console.log('displaying potato');

  randomNum = 4;

  while (randomNum === 4) {
    randomNum = Math.floor(Math.random() * 4);
  }

  if (randomNum === 0) {
    ctx.font = '60px serif';
    ctx.arc(ctx.width / 2 - 100, ctx.height / 2 - 100, 100, 0, 2 * Math.PI);
    ctx.strokeText('W', ctx.width / 2 - 30, ctx.height / 2);

    setTimeout(function () {
      if (dDown) {
        socket.emit('pass', { room: room, hash: hash });
      } else {
        socket.emit('fail', { room: room, hash: hash });
      }
    }, 3000);
  } else if (randomNum === 1) {
    ctx.font = '60px serif';
    ctx.arc(ctx.width / 2 - 100, ctx.height / 2 - 100, 100, 0, 2 * Math.PI);
    ctx.strokeText('A', ctx.width / 2 - 30, ctx.height / 2);

    setTimeout(function () {
      if (dDown) {
        socket.emit('pass', { room: room, hash: hash });
      } else {
        socket.emit('fail', { room: room, hash: hash });
      }
    }, 3000);
  } else if (randomNum === 2) {
    ctx.font = '60px serif';
    ctx.arc(ctx.width / 2 - 100, ctx.height / 2 - 100, 100, 0, 2 * Math.PI);
    ctx.strokeText('S', ctx.width / 2 - 30, ctx.height / 2);

    setTimeout(function () {
      if (dDown) {
        socket.emit('pass', { room: room, hash: hash });
      } else {
        socket.emit('fail', { room: room, hash: hash });
      }
    }, 3000);
  } else if (randomNum === 3) {
    ctx.font = '60px serif';
    ctx.arc(ctx.width / 2 - 100, ctx.height / 2 - 100, 100, 0, 2 * Math.PI);
    ctx.strokeText('D', ctx.width / 2 - 30, ctx.height / 2);

    setTimeout(function () {
      if (dDown) {
        socket.emit('pass', { room: room, hash: hash });
      } else {
        socket.emit('fail', { room: room, hash: hash });
      }
    }, 3000);
  }
};

//handle for key down events
var keyDownHandler = function keyDownHandler(e) {
  var keyPressed = e.which;

  // W
  if (keyPressed === 87 || keyPressed === 38) {
    wDown = true;
  }
  // A
  else if (keyPressed === 65 || keyPressed === 37) {
      aDown = true;
    }
    // S
    else if (keyPressed === 83 || keyPressed === 40) {
        sDown = true;
      }
      // D
      else if (keyPressed === 68 || keyPressed === 39) {
          dDown = true;
        }
        //Space key was lifted
        else if (keyPressed === 32) {
            sendPass(); //call to invoke an pass
          }
};

//handler for key up events
var keyUpHandler = function keyUpHandler(e) {
  var keyPressed = e.which;

  // W OR UP
  if (keyPressed === 87 || keyPressed === 38) {
    wDown = false;
  }
  // A OR LEFT
  else if (keyPressed === 65 || keyPressed === 37) {
      aDown = false;
    }
    // S OR DOWN
    else if (keyPressed === 83 || keyPressed === 40) {
        sDown = false;
      }
      // D OR RIGHT
      else if (keyPressed === 68 || keyPressed === 39) {
          dDown = false;
        }
};
'use strict';

// credit to Project2-590 by Aidan Kaufman
var canvas = void 0;
var ctx = void 0;

var socket = void 0;
var hash = void 0;
var room = void 0;
var myNum = void 0;
var players = {}; //character list

var animationFrame = void 0;
var randomNum = void 0;

var wDown = void 0,
    aDown = void 0,
    sDown = void 0,
    dDown = void 0;

var joinGame = function joinGame() {
  console.log('join GAME clicked');
  socket.emit('requestAccess', {});
};

var init = function init() {

  socket = io.connect();

  socket.on('connect', function () {

    canvas = document.querySelector('#canvas');
    ctx = canvas.getContext('2d');

    socket.on('joined', setUser);
    socket.on('gameStart', startGame);

    document.querySelector('#joinButton').onclick = joinGame;
    document.body.addEventListener('keydown', keyDownHandler);
    document.body.addEventListener('keyup', keyUpHandler);
  });
};

window.onload = init;
