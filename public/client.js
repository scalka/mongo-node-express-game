// Client side code - game page
// PlayerCircle Parent class (or subclass) - Player class
class PlayerOpponent {
  constructor(id = '', x, y, radius = 30, color) {
    this.id = id;
    this.x = Math.floor((Math.random() * 1000) + 1);
    this.y = Math.floor((Math.random() * 1000) + 1);
    this.radius = radius;
    this.color = color;
    this.strokeW = 1;
    this.speed = 4;
    this.angle = 55;
    this.vx = Math.cos(this.angle * Math.PI / 180) * this.speed;
    this.vy = Math.sin(this.angle * Math.PI / 180) * this.speed;
    this.ax = 0;
    this.ay = 0;
    this.collision = false;
    this.nickname = 'nicnkame';
  }

  setId(id) {
    this.id = id;
    return this;
  }

  draw() {
    this.vx += this.ax;
    this.vy += this.ay;
    this.x += this.vx;
    this.y += this.vy;
    strokeWeight(this.strokeW);
    fill(this.color);
    ellipse(this.x, this.y, this.radius);
    this.canvasCollision();
    return this;
  }

  canvasCollision() {
    if (this.x <= 0 || this.x >= 1000 ) {
      this.vx = -this.vx;
    }
    if (this.y <= 0 || this.y >= 1000) {
      this.vy = -this.vy;
    }
    return this;
  }
} // end of PlayerCircle
// Player child class
class PlayerCircle extends PlayerOpponent {
  constructor(id = '', x, y, radius = 30, color = '#7fcad0') {
    super(id, x, y, radius, color);
    this.strokeW = 3;
    this.speed = 4;
    this.angle = 30;
    this.vx = Math.cos(this.angle * Math.PI / 180) * this.speed;
    this.vy = Math.sin(this.angle * Math.PI / 180) * this.speed;
    this.ax = 0;
    this.ay = 0;
    this.bad_collision = false;
    this.good_collision = false;
  }
  // object collision
  checkCollision(objectB) {
    this.bad_collision = false;
    this.good_collision = false;
    let dx = this.x - objectB.x;
    let dy = this.y - objectB.y;
    //let distance = this.radius;
    if (dx * dx + dy * dy <= this.radius * objectB.radius) {
    	this.collision = true;
      if ( this.radius > objectB.radius ) {
        this.radius += 4;
        this.vx = -this.vx;
        this.good_collision = true;
      } else if ( objectB.radius >= this.radius ) {
        this.bad_collision = true;
      }
    }
    return this;
  }
  //keyboard controls
  turn(direction) {
    switch (direction) {
    case 39: // right
      this.vx = 1 * this.speed;
      this.vy = 0 * this.speed;
      break;
    case 37: // left
      //this.vx = -this.vx;
      this.vx = -1 * this.speed;
      this.vy = 0 * this.speed;
      break;
    case 40: //down
      //this.vy = -this.vy;
      this.vx = 0 * this.speed;
      this.vy = 1 * this.speed;
      break;
    case 38: // up
      //this.vy = -this.vy;
      this.vx = 0 * this.speed;
      this.vy = -1 * this.speed;
      break;
    case 27: // up
      exitScreen();
      console.log('escape');
      break;
    }
  }
}
// background class
class Grid {
  constructor(rows, cols) {
    this.grid = []; // A multidimentional array containing the visual grid
    this.cell = {};
    this.rowsCount = rows; // The height of the map, in rows
    this.colsCount = cols; // The width of the map, in columns
    this.tileSize = 64; // The tile size, in pixels
  }
  // draw on canvas
  render() {
    // creating multidimentional array of grid cells
    for (let column = 0; column < this.colsCount; column++) {
      this.grid[column] = []; // create the next row (inner array)
      for (let row = 0; row < this.rowsCount; row++) {
        fill(255);
        strokeWeight(1);
        this.cell = {
          column: column,
          row: row,
          square: rect(column * this.tileSize, row * this.tileSize, this.tileSize, this.tileSize)
        };
        this.grid[column][row] = this.cell;
      }
    }
  }
}

/*
.emit Sends messages between server-client(s).
.on Handles incoming messages
*/
const socket = io.connect();
let opponnents = [];
let food = [];
let player;
let some_id;
let score = document.getElementById('score');
let no_exitscreen = true;
let exit_btn = document.getElementById('exit_btn');
// pause screen diaplay
let exitScreen = () => {
  if(no_exitscreen) {
    no_exitscreen = false;
    document.getElementById('exit_btn').style.display = 'block';
  } else {
    no_exitscreen = true;
    document.getElementById('exit_btn').style.display = 'none';
  }
};
// random color generator
let randomColor = () => {
  let x = Math.floor(Math.random() * 256);
  let y = Math.floor(Math.random() * 256);
  let z = Math.floor(Math.random() * 256);
  return 'rgb(' + x + ',' + y + ',' + z + ')';
};

//PROCESSING at start
function setup() {
  let nickname = prompt('Nickname: ');
  createCanvas(1000, 1000);
  player = new PlayerCircle();
  player.nickname = nickname;
  for (let i = 0; i < 15; i++) {
    let snack = new PlayerOpponent(i, Math.floor((Math.random() * 1000) + 1), Math.floor((Math.random() * 1000) + 1), Math.floor((Math.random() * 50) + 1), randomColor());
    food.push(snack);
  }
  grid = new Grid(20, 20);
  grid.render();
  score.innerHTML = `Score: ${player.radius}`;

  exit_btn.addEventListener('click', () => {
    saveScore(player.nickname, player.radius);
  });
}
//PROCESSING every .. seconds
function draw() {
  grid.render();
  if(no_exitscreen) {
    socket.emit('updateOpponents', player);
    // check for opponents collision and draw opponents
    for (let i = 0; i < opponnents.length; i++) {
      if(opponnents[i].id !== player.id) {
        player.checkCollision(opponnents[i]);
        if (player.good_collision) {
          socket.emit('playerLost', opponnents[i]);
          console.log('winner');
        } else if (player.bad_collision) {
          window.location.href = '/index.html';
          console.log('looser');
        } else {
          opponnents[i].draw();
        }
      }
    }
    // draw snacks
    food.forEach(function(snack) {
      player.checkCollision(snack);
      if ( player.good_collision ) {
        snack.x = 0;
        snack.y = 0;
      } else if (player.bad_collision) {
        saveScore(player.nickname, player.radius);
        window.location.href = '/index.html';
        console.log('looser');
      }
      snack.draw();
    });
    // draw player on canvas
    player.draw();
    // update score
    score.innerHTML = `Score: ${player.radius}`;
  }
}

function keyPressed() {
  player.turn(keyCode);
}

// socket.io
socket.on('connect', function(data) {
  player.setId(socket.id);
  socket.emit('newPlayer',  player );
});
// creating all opponents
socket.on('playersList', function(data) {
  opponnents.length = 0;
  for (let i = 0; i < data.length; i++) {
    let new_player = new PlayerOpponent(data[i].id, data[i].x, data[i].y, data[i].radius, randomColor());
    opponnents.push(new_player);
  }
});

socket.on('updatedPlayersList', function(data) {
  opponnents.length = 0;
  for (let i = 0; i < data.length; i++) {
    let new_player = new PlayerOpponent(data[i].id, data[i].x, data[i].y, data[i].radius, randomColor());
    opponnents.push(new_player);
  }
//  let check = opponnents.findIndex(x => x.id === player.id);
//  opponnents.splice(check, 1);
});

socket.on('updatedPlayersPosition', function(data) {
  for (let i = 0; i < opponnents.length; i++) {
    opponnents[i].x = data[i].x;
    opponnents[i].y = data[i].y;
    opponnents[i].radius = data[i].radius;
    opponnents[i].vx = data[i].vx;
    opponnents[i].vy = data[i].vy;
    opponnents[i].ax = data[i].ax;
    opponnents[i].ay = data[i].ay;
  }
});

socket.on('youLost', function(data) {
  // game over screen
  saveScore(player.nickname, player.radius);
  window.location.href = data;
});

function saveScore(nickname, score) {
  console.log('saving score to the database');
  fetch('/leaderboardUpdate', {
    method: 'POST',
    body: JSON.stringify({nickname: nickname, score: score}),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
    .then(function(response) {
      if(response.ok) {
        console.log('user was recorded');
        return;
      }
      throw new Error('Request failed.');
    })
    .catch(function(error) {
      console.log(error);
    });
};
