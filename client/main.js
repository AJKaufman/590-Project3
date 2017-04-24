// credit to Project2-590 by Aidan Kaufman
let canvas;
let ctx;

let socket;
let hash;
let room;
let players = {}; //character list

let animationFrame;
let randomNum;


let wDown, aDown, sDown, dDown;

const joinGame = () => {
  console.log('join GAME clicked');
  socket.emit('requestAccess', {});
};

const init = () => {
   
  socket = io.connect();
  
  socket.on('connect', () => {
    
    canvas = document.querySelector('#canvas');
    ctx = canvas.getContext('2d');

    socket.on('joined', setUser);
    socket.on('removeWaitMessage', removeWaitMessage);
    socket.on('gameStart', startGame);  

    document.querySelector('#joinButton').onclick = joinGame;
    document.body.addEventListener('keydown', keyDownHandler);
    document.body.addEventListener('keyup', keyUpHandler);
    
  }
};

window.onload = init;