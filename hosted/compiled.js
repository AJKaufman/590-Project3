"use strict";

var redraw = function redraw(time) {

  ctx.clearRect(0, 0, 1000, 1000);
};
'use strict';

// using gravity assignment
var setUser = function setUser(data) {

  // if you are the new user, set your data
  if (!hash) {
    console.log('setting user');
    room = data.room;
    hash = data.hash;
    myNum = data.playerCount;
    data.next = myNum;
    framesPassedSinceLetter = 0;
    correctPress = false;
    timeToPress = 180;
  }

  console.log('myNum = ' + myNum);

  var content = document.querySelector('#mainMessage');
  content.innerHTML = 'Player Count: ' + data.playerCount + '/3';

  if (myNum === 3) {
    setTimeout(passPotato(data), 2000);
  }
};

var passPotato = function passPotato(data) {

  //saving the potatoPossessor
  potatoPossessor = data.next;
  console.log(potatoPossessor + " is the potatoPossessor");

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
    if (potatoPossessor === myNum) {
      timeToPress = 180; // initial potato delay set to 3 seconds
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

  canPass = true;

  console.log('displaying potato');

  randomNum = 4;

  while (randomNum === 4) {
    randomNum = Math.floor(Math.random() * 4);
  }

  console.log('randomNum = ' + randomNum);

  // create the potato
  ctx.clearRect(0, 0, 1000, 1000);
  ctx.strokeStyle = 'white';
  ctx.font = '60px serif';
  ctx.fillStyle = '#D9865D';
  ctx.beginPath();
  ctx.arc(500, 300, 100, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();

  displayLetter(randomNum);
};

var displayLetter = function displayLetter(randomNum) {
  if (randomNum === 0) {
    ctx.strokeText('W', 470, 300);
    currentLetter = 'w';
    console.log('current letter = ' + currentLetter);

    requestAnimationFrame(function () {
      update('w');
    });
  } else if (randomNum === 1) {
    ctx.strokeText('A', 470, 300);
    currentLetter = 'a';
    console.log('current letter = ' + currentLetter);

    requestAnimationFrame(function () {
      update('a');
    });
  } else if (randomNum === 2) {
    ctx.strokeText('S', 470, 300);
    currentLetter = 's';
    console.log('current letter = ' + currentLetter);

    requestAnimationFrame(function () {
      update('s');
    });
  } else {
    ctx.strokeText('D', 470, 300);
    currentLetter = 'd';
    console.log('current letter = ' + currentLetter);

    requestAnimationFrame(function () {
      update('d');
    });
  }
};

// checks for button presses
var update = function update(letter) {

  ctx.beginPath();
  ctx.arc(100, framesPassedSinceLetter / timeToPress * 1000, 20, 0, 2 * Math.PI);
  ctx.fill();

  framesPassedSinceLetter++;

  if (framesPassedSinceLetter > timeToPress) {
    socket.emit('fail', { room: room, hash: hash });
  }

  // if they pressed the right button, display the next letter
  if (correctPress && canPass) {

    if (timeToPress > 30) {
      // make it go speedy faster every press
      timeToPress *= 0.9;
    }

    framesPassedSinceLetter = 0;
    correctPress = false;
    displayPotato();
  } else {
    requestAnimationFrame(update);
  }
};

//handle for key down events
var keyDownHandler = function keyDownHandler(e) {
  var keyPressed = e.which;

  // W
  if (keyPressed === 87 || keyPressed === 38) {
    wDown = true;
    if (currentLetter === 'w') {
      console.log('w down');
      correctPress = true;
    } else {
      socket.emit('fail', { room: room, hash: hash });
    }
  }
  // A
  else if (keyPressed === 65 || keyPressed === 37) {
      aDown = true;
      if (currentLetter === 'a') {
        console.log('a down');
        correctPress = true;
      } else {
        socket.emit('fail', { room: room, hash: hash });
      }
    }
    // S
    else if (keyPressed === 83 || keyPressed === 40) {
        sDown = true;
        if (currentLetter === 's') {
          console.log('s down');
          correctPress = true;
        } else {
          socket.emit('fail', { room: room, hash: hash });
        }
      }
      // D
      else if (keyPressed === 68 || keyPressed === 39) {
          dDown = true;
          if (currentLetter === 'd') {
            console.log('d down');
            correctPress = true;
          } else {
            socket.emit('fail', { room: room, hash: hash });
          }
        }
        //Space key was pressed
        else if (keyPressed === 32) {
            if (potatoPossessor === myNum) {
              ctx.clearRect(0, 0, 1000, 600);
              canPass = false;
              socket.emit('pass', { room: room, hash: hash, myNum: myNum });
            } else {
              console.log(potatoPossessor + " is the potatoPossessor, and I am " + myNum);
            }
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
var players = {}; //character list'
var potatoPossessor = void 0;

var animationFrame = void 0;
var frameCounter = void 0;

var timeToPress = void 0;
var canPass = false;
var randomNum = void 0;
var correctPress = void 0;
var currentLetter = void 0;
var potatoPrompt = void 0;
var framesPassedSinceLetter = void 0;
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

  ctx.clearRect(0, 0, 1000, 1000);

  if (data.hash === hash) {
    content.innerHTML = 'You lose!';
    ctx.strokeText('You lose!', 300, 300);
  } else {
    ctx.strokeStyle = 'white';
    ctx.font = '20px serif';
    content.innerHTML = 'You lived!';
    ctx.strokeText('You lived!', 300, 300);
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
