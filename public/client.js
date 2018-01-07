// PROCESSING START
// ----------------------------
// Circle Parent class (or subclass) - Player class
// ----------------------------
class Circle {
  constructor(x = 0, y = 0, r = 10, col = '#ffc689') {
    this.x = x;
    this.y = y;
    this.r = r;
    this.col = col;
    this.vx = Math.random(-5, 5);
    this.vy = Math.random(-5, 5);
    this.angle = 25;
    this.speed = 5;
  }

  move() {
    // without this scope is in betwen {} so we need
    this.x += this.vx;
    this.y += this.vy;
  }

  turn() {
    this.angle += 25;
    this.vx = Math.cos(this.angle * (Math.PI / 180)) * this.speed;
    this.vy = Math.sin(this.angle * (Math.PI / 180)) * this.speed;
  }

  draw() {
    fill(this.col);
    ellipse(this.x, this.y, this.r);
    return this;
  }
}
// ----------------------------
// Tailed Child class (or subclass)
// ----------------------------

class TailedCircle extends Circle {
  constructor(x = 50, y = 50, r = 10, col = '#ffc689') {
    super(x, y, r, col);
    this.num_segments = 1;
    this.x_start = this.x;
    this.y_start = this.y;
    this.x_cor = [];
    this.y_cor = [];
    this.line_x = [];
    this.line_y = [];
    this.gridTouch = false;
  }
  draw() {
    fill(this.col);
    ellipse(this.x, this.y, this.r);
    return this; // allows method chaining
  }
  drawTail(grid) {
    noFill();
    stroke(255, 0, 0);
    beginShape();
    for (let i = 0; i < this.x_cor.length; i++) {
      // Check for this.x_cor[i + 1] so no empty variable in spot #2 (zero-based index)
      if (this.x_cor[i + 1]) {
        this.line_x[i] = Math.round(this.x_cor[i + 1]);
        this.line_y[i] = Math.round(this.y_cor[i + 1]);
        line(this.x_cor[i], this.y_cor[i], this.x_cor[i + 1], this.y_cor[i + 1]);

      }
      // endShape();
      fill(255, 204, 0, 50);
    }
    this.x_cor.push(this.x);
    this.y_cor.push(this.y);
    return this;
  }
  move(grid) {
    // reverse direction ('bounce')
    //console.log(grid);
    this.expandTerrain(grid, this.x, this.y);
    this.collision().drawTail(grid);
    this.x += this.vx;
    this.y += this.vy;

    return this; // allows method chaining
  }

  expandTerrain(grid, x, y) {
    //console.log(x);
    //console.log(this.line_x);
    if ( this.line_x.includes(Math.round(x)) && this.line_y.includes(Math.round(y)) ) {
      console.log("x touch");
      let columnsArray = [];
      let rowsArray = [];

      this.line_x.forEach(function(x_coord) {
          columnsArray =Math.round(x_coord/100);
      });
      this.line_y.forEach(function(y_coord) {
        rowsArray = Math.round(y_coord/100);
      });
      this.gridTouch = true;
    } else {
      this.gridTouch = false;
    }
  }
  collision(objectA, objectB) {
    if (this.x <= 0 || this.x >= 1000 ) {
      this.vx = -this.vx;
    }
    if (this.y <= 0 || this.y >= 1000) {
      this.vy = -this.vy;
    }

    return this;
  }
}

class Grid {
  constructor(rows, cols){
    this.grid = []; // A multidimentional array containing the visual grid
    this.cell = {};
    this.rowsCount = rows; // The height of the map, in rows
    this.colsCount = cols; // The width of the map, in columns
    this.tileSize = 64; // The tile size, in pixels
  }

  render() {
    //console.log("render");
      for (let column = 0; column < this.colsCount; column++) {
        this.grid[column] = []; // create the next row (inner array)
        for (let row = 0; row < this.rowsCount; row++) {
          fill(255);
          stroke(0);
          this.cell = {
            column: column,
            row: row,
            square: rect(column * this.tileSize, row * this.tileSize, this.tileSize, this.tileSize)
          }
          this.grid[column][row] = this.cell;
        }
      }
  }

  gridTouch(circle, column, row) {
    //console.log(`Circle is touching grid`);
    //console.log(circle);

    stroke(100);
    this.cell = {
      column: column,
      row: row,
      square: rect(column * this.tileSize, row * this.tileSize, this.tileSize, this.tileSize)
    }
    this.grid[column][row] = this.cell;
  }
}

/*
.emit Sends messages between server-client(s).
.on Handles incoming messages
*/
const socket = io.connect();


socket.on('news', function (data) {
  console.log(data);
  socket.emit('my other event', { my: 'data' });
});

//PROCESSING at start
function setup() {
	createCanvas(1000, 1000);
  player = new TailedCircle(50, 50, 50);
  grid = new Grid(30, 30);
  grid.render();
}
//PROCESSING every .. seconds
function draw() {
	//clear background
	//background("#2834ff");
  grid.render();
  player.draw().move(grid);
  if (player.gridTouch){
    grid.gridTouch(player, 4, 5);
  }
}
//PROCESSING every mouseclick
function mousePressed() {
	player.turn();
}

// PROCESSING END

const button = document.getElementById('myButton');
button.addEventListener('click', function(e) {
  console.log('button was clicked');

  fetch('/clicked', {method: 'POST'})
    .then(function(response) {
      if(response.ok) {
        console.log('click was recorded');
        return;
      }
      throw new Error('Request failed.');
    })
    .catch(function(error) {
      console.log(error);
    });
});

setInterval(function() {
  fetch('/clicks', {method: 'GET'})
    .then(function(response) {
      if(response.ok) return response.json();
      throw new Error('Request failed.');
    })
    .then(function(data) {
      document.getElementById('counter').innerHTML = `Button was clicked ${data.length} times`;
    })
    .catch(function(error) {
      console.log(error);
    });
}, 1000);
