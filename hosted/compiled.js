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
    myScore = 10;
  }

  console.log('myNum = ' + myNum);

  var content = document.querySelector('#mainMessage');
  ctx.clearRect(0, 0, CANVASWIDTH, CANVASHEIGHT);
  ctx.fillStyle = 'white';
  ctx.font = '20px serif';
  ctx.fillText('Player Count: ' + data.playerCount + '/3', CWHALF - 70, CHHALF);
  content.innerHTML = 'Player Count: ' + data.playerCount + '/3';

  if (myNum === 3) {
    setTimeout(passPotato(data), 2000);
  }
};

// passes the potato to the next person
var passPotato = function passPotato(data) {

  // set the styles
  ctx.clearRect(0, 0, CANVASWIDTH, CANVASHEIGHT);
  ctx.fillStyle = 'white';
  ctx.font = '30px serif';

  //saving the potatoPossessor
  potatoPossessor = data.next;
  console.log(potatoPossessor + " is the potatoPossessor");

  // player with potato div
  var content = document.querySelector('#mainMessage');

  if (data.primaryPotato) {
    // is this the first round?
    // allow the primary potato to start the game with hot potato in hand
    if (data.primaryPotato === myNum) {

      ctx.fillText('You have the potato!', CWHALF - 110, CHHALF);
      content.innerHTML = '<div>You have the potato!</div>';
      setTimeout(displayPotato, 3000);
    } else {
      ctx.fillText('Player ' + data.next + ' has the potato', CWHALF - 130, CHHALF);
      content.innerHTML = '<div>Player ' + data.primaryPotato + ' has the potato</div>';
    }
  } else {
    // it is not the first round
    if (potatoPossessor === myNum) {
      timeToPress = 180; // initial potato delay set to 3 seconds
      ctx.fillText('You have the potato!', CWHALF - 110, CHHALF);
      content.innerHTML = '<div>You have the potato!</div>';
      canPass = false;
      setTimeout(displayPotato, 3000);
    } else {
      ctx.fillText('Player ' + data.next + ' has the potato', CWHALF - 130, CHHALF);
      content.innerHTML = '<div>Player ' + data.next + ' has the potato</div>';
    }
  }
};

// displays the potato with the letter
var displayPotato = function displayPotato() {

  document.body.addEventListener('keydown', keyDownHandler);
  document.body.addEventListener('keyup', keyUpHandler);

  randomNum = 4;

  while (randomNum === 4) {
    randomNum = Math.floor(Math.random() * 4);
  }

  // create the potato
  ctx.clearRect(0, 0, CANVASWIDTH, CANVASHEIGHT);
  ctx.strokeStyle = 'blue';
  ctx.font = '60px serif';
  ctx.fillStyle = '#D9865D';
  ctx.beginPath();
  ctx.arc(CWHALF, CHHALF, 200, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();

  potateImg = new Image();

  displayLetter(randomNum);

  console.log('displaying potato');
  canPass = true;
};

// displays the potates and the letters so the players know what to press
var displayLetter = function displayLetter(randomNum) {

  potateImg.width = 30;
  potateImg.height = 30;

  if (randomNum === 0) {
    ctx.fillText('W', 0, 100);
    potateImg.src = '../assets/img/potate1.png';
    ctx.drawImage(potateImg, CWHALF / 1.3, 0);
    currentLetter = 'w';
    requestAnimationFrame(function () {
      update('w');
    });
  } else if (randomNum === 1) {
    ctx.fillText('A', 0, 100);
    potateImg.src = '../assets/img/face.png';
    ctx.drawImage(potateImg, CWHALF / 1.8, 0);
    currentLetter = 'a';
    requestAnimationFrame(function () {
      update('a');
    });
  } else if (randomNum === 2) {
    ctx.fillText('S', 0, 100);
    potateImg.src = '../assets/img/potate3.png';
    ctx.drawImage(potateImg, CWHALF / 1.5, CHHALF / 3.3);
    currentLetter = 's';
    requestAnimationFrame(function () {
      update('s');
    });
  } else {
    ctx.fillText('D', 0, 100);
    potateImg.src = '../assets/img/potate4.png';
    ctx.drawImage(potateImg, CWHALF / 1.4, CHHALF / 3);
    currentLetter = 'd';
    requestAnimationFrame(function () {
      update('d');
    });
  }
};

// checks for button presses
var update = function update(letter) {

  // animates the heat meter
  ctx.fillStyle = '#CE100B';
  ctx.fillRect(framesPassedSinceLetter / timeToPress * CANVASWIDTH, 0, 30, 30);

  // displays 'HOT' on the screen indicating that the potate is hot
  if (framesPassedSinceLetter % 60 === 0) {

    var randX = Math.abs(Math.random() * CANVASWIDTH - 300);
    randX += 100;
    var randY = Math.abs(Math.random() * CANVASHEIGHT - 200);
    randY += 75;
    ctx.fillText('HOT', randX, randY);
  }

  framesPassedSinceLetter++;

  if (framesPassedSinceLetter > timeToPress) {
    console.log('Hash: ' + hash);
    myScore = 0;
    socket.emit('fail', { room: room, hash: hash });
    return;
  }

  // if they pressed the right button, display the next letter
  if (correctPress) {

    if (timeToPress > 30) {
      // make it go speedy faster every press
      timeToPress *= 0.9;
    }

    myScore += 10; // correct! Gain 10 points

    framesPassedSinceLetter = 0;
    correctPress = false;
    displayPotato();
  } else if (canPass && !GameOver) {
    requestAnimationFrame(update);
  }
};

var sendPoints = function sendPoints(data) {
  console.log('Hash: ' + data.hash);
  canPass = false;
  highScore = myScore; // give the high score a base to start off at
  socket.emit('myScore', { myHash: hash, hash: data.hash, myScore: myScore, room: room, myNum: myNum });
};

//handle for key down events
var keyDownHandler = function keyDownHandler(e) {
  var keyPressed = e.which;

  // W
  if (keyPressed === 87 || keyPressed === 38) {
    wDown = true;
    if (currentLetter === 'w') {
      correctPress = true;
    } else {
      console.log('hash: ' + hash);
      myScore = 0;
      socket.emit('fail', { room: room, hash: hash });
    }
  }
  // A
  else if (keyPressed === 65 || keyPressed === 37) {
      aDown = true;
      if (currentLetter === 'a') {
        correctPress = true;
      } else {
        console.log('hash: ' + hash);
        myScore = 0;
        socket.emit('fail', { room: room, hash: hash });
      }
    }
    // S
    else if (keyPressed === 83 || keyPressed === 40) {
        sDown = true;
        if (currentLetter === 's') {
          correctPress = true;
        } else {
          console.log('hash: ' + hash);
          myScore = 0;
          socket.emit('fail', { room: room, hash: hash });
        }
      }
      // D
      else if (keyPressed === 68 || keyPressed === 39) {
          dDown = true;
          if (currentLetter === 'd') {
            correctPress = true;
          } else {
            console.log('hash: ' + hash);
            myScore = 0;
            socket.emit('fail', { room: room, hash: hash });
          }
        }
        //Space key was pressed
        else if (keyPressed === 32) {
            if (potatoPossessor === myNum && canPass) {

              document.body.removeEventListener('keydown', keyDownHandler);
              document.body.removeEventListener('keyup', keyUpHandler);

              ctx.clearRect(0, 0, CANVASWIDTH, CANVASHEIGHT);
              framesPassedSinceLetter = 0; // reset the frames to lose
              canPass = false;
              console.log('passing');
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

// using code from DomoMaker E by Aidan Kaufman
var handleError = function handleError(message) {
  $("#errorMessage").text(message);
};

var redirect = function redirect(response) {
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({

    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: 'json',
    success: success,
    error: function error(xhr, status, _error) {

      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};

var sendAjaxHTML = function sendAjaxHTML(type, action, data, success) {
  $.ajax({

    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: 'html',
    success: success,
    error: function error(xhr, status, _error2) {

      var messageObj = xhr.responseText;
      handleError(messageObj.error);
    }
  });
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
var GameOver = false;

var animationFrame = void 0;
var frameCounter = void 0;

var timeToPress = void 0;
var canPass = false;
var randomNum = void 0;
var correctPress = void 0;
var currentLetter = void 0;
var potatoPrompt = void 0;
var potateImg = void 0;
var framesPassedSinceLetter = void 0;
var myScore = void 0;
var highScore = void 0;
var wDown = void 0,
    aDown = void 0,
    sDown = void 0,
    dDown = void 0;
var displayMessageCount = 0;

var CANVASWIDTH = 800;
var CWHALF = 400;
var CANVASHEIGHT = 400;
var CHHALF = 200;

var joinGame = function joinGame() {
  console.log('join GAME clicked');
  var instructions = document.querySelector('#instructions');
  instructions.innerHTML = '';
  var button = document.querySelector('#joinButton');
  button.innerHTML = '';
  document.querySelector('#joinButton').onclick = false;
  socket.emit('requestAccess', {});
};

var logout = function logout() {
  console.log('logout clicked');
  sendAjaxHTML('GET', '/logout', null, redirect);
  // redirect('/logout'); AIDAN
  // problem is that I don't know how to get the res
};

var endGame = function endGame(data) {

  var content = document.querySelector('#mainMessage');

  ctx.clearRect(0, 0, CANVASWIDTH, CANVASHEIGHT);

  // increases the high score for better winner logic
  if (data.score >= highScore) {
    highScore = data.score;
  }

  if (data.hash === null && GameOver === false) {
    content.innerHTML = 'Oh no, someone left!';
  } else if (data.hash === data.myHash) {
    var results = document.querySelector('#results');
    results.innerHTML += '<div class="endingMessage">Player ' + data.num + ' got burned and lost!</div>';
    if (data.hash === hash) content.innerHTML = 'You lose!';
  } else if (data.hash !== null) {
    if (myScore === 0) {
      content.innerHTML = 'You lose!';
    } else if (highScore <= myScore) {
      highScore = myScore;
      content.innerHTML = 'You win!';
    } else {
      content.innerHTML = 'You lived!';
    }
    GameOver = true;
    var _results = document.querySelector('#results');
    _results.innerHTML += '<div class="endingMessage">Player ' + data.num + '\'s score is: ' + data.score + '</div>';
  }

  console.log('removing canvas');
  // turn off eventListeners
  $('canvas').remove();
  document.body.removeEventListener('keydown', keyDownHandler);
  document.body.removeEventListener('keyup', keyUpHandler);

  //  let mainMenuButton = document.querySelector('#returnToMainMenu');
  //  mainMenuButton.innerHTML = '<form onSubmit="mainMenu()">';
  //  mainMenuButton.innerHTML += '<input class="mainMenu" type="submit" value="Main Menu" />';
  //  mainMenuButton.innerHTML += '</form>';

  var playAgainButton = document.querySelector('#playAgain');
  playAgainButton.innerHTML = '<input class="playAgain" type="button" value="Play Again?" />';
  playAgainButton.onclick = playAgain;
};

// main menu
var mainMenu = function mainMenu() {
  console.log('main menu');
  var content = document.querySelector('#mainMessage');
  content.innerHTML = "";
};

// displaying instructions
var displayInstructions = function displayInstructions() {
  var instructions = document.querySelector('#instructions');
  instructions.innerHTML = "<div>Goal: Get the most points, and don't get burned!</div>";
  instructions.innerHTML += "<div>Getting burned: You get burned by pressing the wrong button, or letting the timer hit the right side of the screen!</div>";
  instructions.innerHTML += "<div>Getting points: When you have the potate, press the buttons on the left side of the screen.</div>";
  instructions.innerHTML += "<div>Be warned: The more you press the correct buttons, the faster you have to react!</div>";
  instructions.innerHTML += "<div>Press the space bar to pass the potato to the next player and cool down!</div>";
};

// reload the page
var playAgain = function playAgain() {
  console.log('reloading');
  location.reload();
};

var init = function init() {

  socket = io.connect();

  socket.on('connect', function () {

    canvas = document.querySelector('#canvas');
    ctx = canvas.getContext('2d');

    socket.on('joined', setUser);
    socket.on('passingToNext', passPotato);
    socket.on('askPoints', sendPoints);
    socket.on('endingGame', endGame);

    //document.querySelector('#logoutButton').onclick = logout;
    document.querySelector('#joinButton').onclick = joinGame;
    document.querySelector('#instructions').onclick = displayInstructions;
    //    document.querySelector('.mmNav').onclick = sendAjax("GET", '/', null, redirect);
    //    document.querySelector('.hpNav').onclick = sendAjax("GET", '/', null, redirect);
    //document.querySelector('#instructions');
  });
};

window.onload = init;
