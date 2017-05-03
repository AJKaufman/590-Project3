// credit to Project2-590 by Aidan Kaufman
let canvas;
let ctx;

let socket;
let hash;
let room;
let myNum;
let players = {}; //character list

let animationFrame;
let frameCounter;

let randomNum;
let correctPress;
let potatoPrompt;
let wDown, aDown, sDown, dDown;

const joinGame = () => {
  console.log('join GAME clicked');
  const button = document.querySelector('#joinButton');
  button.innerHTML = '';
  socket.emit('requestAccess', {});
};

 
const endGame = (data) => {
  let content = document.querySelector('#mainMessage');
  
  if(data.hash === hash) {
    content.innerHTML = 'You lose!';
  } else {
    content.innerHTML = 'You lived!';
  }
};

const init = () => {

  socket = io.connect();
  
  socket.on('connect', () => {
    
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