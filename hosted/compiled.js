"use strict";

var redraw = function redraw(time) {

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

  console.log('myNum = ' + myNum);

  var content = document.querySelector('#mainMessage');
  content.innerHTML = 'Player Count: ' + data.playerCount + '/3';

  if (myNum === 3) {
    setTimeout(passPotato(data), 3000);
  }
};

var passPotato = function passPotato(data) {

  // player with potato div
  var content = document.querySelector('#mainMessage');

  if (data.primaryPotato) {
    // is this the first round?
    // allow the primary potato to start the game with hot potato in hand
    if (data.primaryPotato === myNum) {

      content.innerHTML = '<div>You have the potato!</div>';
      setTimeout(displayPotato, 3000);
    } else {

      ctx.clearRect(0, 0, 1000, 600);
      ctx.strokeStyle = 'white';
      ctx.font = '20px serif';
      ctx.strokeText('Waiting for primary potato to pass...', 300, 300);
      content.innerHTML = '<div>Player ' + data.primaryPotato + ' has the potato</div>';
    }
  } else {
    // it is not the first round
    if (data.next === myNum) {
      content.innerHTML = '<div>You have the potato!</div>';
      setTimeout(displayPotato, 3000);
    } else {

      ctx.strokeStyle = 'white';
      ctx.font = '20px serif';
      ctx.strokeText('Waiting for primary potato to pass...', 300, 300);
      content.innerHTML = '<div>Player ' + data.next + ' has the potato</div>';
    }
  }
};

// displays the potato with the letter
var displayPotato = function displayPotato() {

  console.log('displaying potato');

  randomNum = 4;

  while (randomNum === 4) {
    randomNum = Math.floor(Math.random() * 4);
  }

  console.log('randomNum = ' + randomNum);

  // create the potato
  ctx.clearRect(0, 0, 1000, 1000);
  ctx.strokeStyle = 'white';
  ctx.fillStyle = '#D9865D';
  ctx.beginPath();
  ctx.arc(500, 300, 100, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();

  if (randomNum === 0) {
    ctx.font = '60px serif';
    ctx.strokeText('W', 470, 300);

    setTimeout(function () {
      if (wDown) {
        socket.emit('pass', { room: room, hash: hash, myNum: myNum });
      } else {
        socket.emit('fail', { room: room, hash: hash });
      }
    }, 3000);
  } else if (randomNum === 1) {
    ctx.font = '60px serif';
    ctx.strokeText('A', 470, 300);

    setTimeout(function () {
      if (aDown) {
        socket.emit('pass', { room: room, hash: hash, myNum: myNum });
      } else {
        socket.emit('fail', { room: room, hash: hash });
      }
    }, 3000);
  } else if (randomNum === 2) {
    ctx.font = '60px serif';
    ctx.strokeText('S', 470, 300);

    setTimeout(function () {
      if (sDown) {
        socket.emit('pass', { room: room, hash: hash, myNum: myNum });
      } else {
        socket.emit('fail', { room: room, hash: hash });
      }
    }, 3000);
  } else if (randomNum === 3) {
    ctx.font = '60px serif';
    ctx.strokeText('D', 470, 300);

    setTimeout(function () {
      if (dDown) {
        socket.emit('pass', { room: room, hash: hash, myNum: myNum });
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
  var button = document.querySelector('#joinButton');
  button.innerHTML = '';
  socket.emit('requestAccess', {});
};

var endGame = function endGame(data) {
  var content = document.querySelector('#mainMessage');

  if (data.hash === hash) {
    content.innerHTML = 'You lose!';
  } else {
    content.innerHTML = 'You lived!';
  }
};

var init = function init() {

  socket = io.connect();

  socket.on('connect', function () {

    canvas = document.querySelector('#canvas');
    ctx = canvas.getContext('2d');

    socket.on('joined', setUser);
    socket.on('passingToNext', passPotato);
    socket.on('endingGame', endGame);

    document.querySelector('#joinButton').onclick = joinGame;
    document.body.addEventListener('keydown', keyDownHandler);
    document.body.addEventListener('keyup', keyUpHandler);
  });
};

window.onload = init;
