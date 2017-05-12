// credit to Project2-590 by Aidan Kaufman
let canvas;
let ctx;

let socket;
let hash;
let room;
let myNum;
let players = {}; //character list'
let potatoPossessor;

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
let wDown, aDown, sDown, dDown;

const CANVASWIDTH = 800;
const CWHALF = 400;
const CANVASHEIGHT = 400;
const CHHALF = 200;


const joinGame = () => {
  console.log('join GAME clicked');
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
  
  console.log("Player " + data.hash + " dropped the potate");
  console.log("I am " + hash);
  
  if(data.hash === null) {
    content.innerHTML = 'Oh no, someone left!';
  }
  else if(data.hash === data.myHash) {
    //content.innerHTML = 'You lose!';
    let results = document.querySelector('#results');
    results.innerHTML += `<div class="endingMessage">Player ${data.num} dropped the potate and lost!</div>`;
    if(data.hash === hash) content.innerHTML = 'You lose!';
  } else {
    if(data.score <= myScore){
      content.innerHTML = 'You win!';
    } else if(myScore === 0) {
      content.innerHTML = 'You lose!';
    } else {
      content.innerHTML = 'You lived!';
    }
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
//    document.querySelector('.mmNav').onclick = sendAjax("GET", '/', null, redirect);;
//    document.querySelector('.hpNav').onclick = sendAjax("GET", '/', null, redirect);
    //document.querySelector('#instructions');
  });
  
};

window.onload = init;