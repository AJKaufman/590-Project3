// credit to Project2-590 by Aidan Kaufman
let canvas;
let ctx;

let socket;
let hash;
let room;
let myNum;
let players = {}; //character list'
let potatoPossessor;
let GameOver = false;


let animationFrame;
let frameCounter;

let timeToPress;
let canPass = false;
let randomNum;
let correctPress;
let currentLetter;
let potatoPrompt;
let potateImg;
let framesPassedSinceLetter;
let myScore;
let highScore;
let wDown, aDown, sDown, dDown;
let displayMessageCount = 0;

const CANVASWIDTH = 800;
const CWHALF = 400;
const CANVASHEIGHT = 400;
const CHHALF = 200;


const joinGame = () => {
  console.log('join GAME clicked');
  let instructions = document.querySelector('#instructions');
  instructions.innerHTML = '';
  const button = document.querySelector('#joinButton');
  button.innerHTML = '';
  document.querySelector('#joinButton').onclick = false;
  socket.emit('requestAccess', {});
};

const logout = () => {
  console.log('logout clicked');
  sendAjaxHTML('GET', '/logout', null, redirect);
  // redirect('/logout'); AIDAN
  // problem is that I don't know how to get the res
};
 
const endGame = (data) => {
    
  let content = document.querySelector('#mainMessage');
  
  ctx.clearRect(0,0,CANVASWIDTH,CANVASHEIGHT);
  
  // increases the high score for better winner logic
  if(data.score >= highScore) {
    highScore = data.score;
  }
  
    if(data.hash === null && GameOver === false) {
      content.innerHTML = 'Oh no, someone left!';
    }
    else if(data.hash === data.myHash) {
      let results = document.querySelector('#results');
      results.innerHTML += `<div class="endingMessage">Player ${data.num} got burned and lost!</div>`;
      if(data.hash === hash) content.innerHTML = 'You lose!';
    } else if(data.hash !== null) {
      if(myScore === 0) {
        content.innerHTML = 'You lose!';
      } else if(highScore <= myScore){
        highScore = myScore;
        content.innerHTML = 'You win!';
      } else {
        content.innerHTML = 'You lived!';
      }
      GameOver = true;
      let results = document.querySelector('#results');
      results.innerHTML += `<div class="endingMessage">Player ${data.num}'s score is: ${data.score}</div>`;
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
  
  let playAgainButton = document.querySelector('#playAgain');
  playAgainButton.innerHTML = '<input class="playAgain" type="button" value="Play Again?" />';
  playAgainButton.onclick = playAgain;
};

// main menu
const mainMenu = () => {
  console.log('main menu');
  let content = document.querySelector('#mainMessage');
  content.innerHTML = "";
};

// displaying instructions
const displayInstructions = () => {
  let instructions = document.querySelector('#instructions');
  instructions.innerHTML = "<div>Goal: Get the most points, and don't get burned!</div>";
  instructions.innerHTML += "<div>Getting burned: You get burned by pressing the wrong button, or letting the timer hit the right side of the screen!</div>";
  instructions.innerHTML += "<div>Getting points: When you have the potate, press the buttons on the left side of the screen.</div>";
  instructions.innerHTML += "<div>Be warned: The more you press the correct buttons, the faster you have to react!</div>";
  instructions.innerHTML += "<div>Press the space bar to pass the potato to the next player and cool down!</div>";
};

// reload the page
const playAgain = () => {
  console.log('reloading');
  location.reload();
};

const init = () => {

  socket = io.connect();
  
  socket.on('connect', () => {
    
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