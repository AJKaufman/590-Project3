const setUser = (data) => {
  
  // if you are the new user, set your data
  if(!hash){
    
    room = data.room;
    hash = data.hash;
  }
  
  // everyone gets an update to say how many people are in the room
  ctx.clearRect(0,0,1000,1000);
  ctx.font = '20px serif';
  ctx.fillText('Player Count: ' + data.playerCount + '/3', ctx.width/2 - 200, ctx.height/2);  
}

const startGame = (data) => {
  
  ctx.clearRect(0,0,1000,1000);
  
  // allow the primary potato to start the game with hot potato in hand
  if(data.primaryPotato) {
    
    setTimeout(displayPotato, 3000);
    
//    ctx.font = '48px serif';
//    ctx.fillText('Press Space to Start!', ctx.width/2 - 200, ctx.height/2);
  } else {
    ctx.font = '20px serif';
    ctx.fillText('Waiting for primary potato to pass...', ctx.width/2 - 200, ctx.height/2);
  }
  
  
}

// displays the potato with the letter
const displayPotato = () => {
  
  randomNum = 4;
  
  while(randomNum === 4) {
    randomNum = Math.floor(Math.random() * 4);
  }
  
  if(randomNum === 0) {
    ctx.font = '60px serif';
    ctx.arc(ctx.width/2 - 100, ctx.height/2 - 100, 100, 0, 2 * Math.PI);
    ctx.fillText('W', ctx.width/2 - 30, ctx.height/2);
    
    setTimeout( () => {
      if(dDown) {
        socket.emit('pass', { room: room, hash: hash, });
      } else {
        socket.emit('fail', { room: room, hash: hash, });
      }
    }, 3000);
  } else if(randomNum === 1) {
    ctx.font = '60px serif';
    ctx.arc(ctx.width/2 - 100, ctx.height/2 - 100, 100, 0, 2 * Math.PI);
    ctx.fillText('A', ctx.width/2 - 30, ctx.height/2);
    
    setTimeout( () => {
      if(dDown) {
        socket.emit('pass', { room: room, hash: hash, });
      } else {
        socket.emit('fail', { room: room, hash: hash, });
      }
    }, 3000);
  } else if(randomNum === 2) {
    ctx.font = '60px serif';
    ctx.arc(ctx.width/2 - 100, ctx.height/2 - 100, 100, 0, 2 * Math.PI);
    ctx.fillText('S', ctx.width/2 - 30, ctx.height/2);
    
    setTimeout( () => {
      if(dDown) {
        socket.emit('pass', { room: room, hash: hash, });
      } else {
        socket.emit('fail', { room: room, hash: hash, });
      }
    }, 3000);
  } else if(randomNum === 3) {
    ctx.font = '60px serif';
    ctx.arc(ctx.width/2 - 100, ctx.height/2 - 100, 100, 0, 2 * Math.PI);
    ctx.fillText('D', ctx.width/2 - 30, ctx.height/2);
    
    setTimeout( () => {
      if(dDown) {
        socket.emit('pass', { room: room, hash: hash, });
      } else {
        socket.emit('fail', { room: room, hash: hash, });
      }
    }, 3000);
  }
  
}


//handle for key down events
const keyDownHandler = (e) => {
  let keyPressed = e.which;

  // W
  if(keyPressed === 87 || keyPressed === 38) {
    wDown = true;
  }
  // A
  else if(keyPressed === 65 || keyPressed === 37) {
    aDown = true;
  }
  // S
  else if(keyPressed === 83 || keyPressed === 40) {
    sDown = true;
  }
  // D
  else if(keyPressed === 68 || keyPressed === 39) {
    dDown = true;
  }
  //Space key was lifted
  else if(keyPressed === 32) {
    sendPass(); //call to invoke an pass
  }
};

//handler for key up events
const keyUpHandler = (e) => {
  let keyPressed = e.which;

  // W OR UP
  if(keyPressed === 87 || keyPressed === 38) {
    wDown = false;
  }
  // A OR LEFT
  else if(keyPressed === 65 || keyPressed === 37) {
    aDown = false;
  }
  // S OR DOWN
  else if(keyPressed === 83 || keyPressed === 40) {
    sDown = false;
  }
  // D OR RIGHT
  else if(keyPressed === 68 || keyPressed === 39) {
    dDown = false;
  }
};