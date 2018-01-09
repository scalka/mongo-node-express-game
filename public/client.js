// PROCESSING START
// ----------------------------
// Circle Parent class (or subclass) - Player class
// ----------------------------
class Circle {
  constructor(x = 5, y = 5, color = '#ffc689') {
    this.x = x;
    this.y = y;
    this.num_segments = 2;
    this.x_cor = [];
    this.y_cor = [];
    this.color = color;
    this.vx = Math.random(-5, 5);
    this.vy = Math.random(-5, 5);
    this.angle = 25;
    this.speed = 5;
    this.tileSize = 64;
  }

  start() {
    for (let i=0; i < this.num_segments; i++){
      this.x_cor.push(this.x + (i * this.tileSize));
      this.y_cor.push(this.y);
      //console.log(this.y + (i * this.tileSize));
    }
  }

  draw() {
    console.log(this);
    fill(this.color);
    for (let i = 0; i < this.num_segments - 1; i++) {
      console.log(this.x_cor);
      rect(this.x_cor[i] * this.tileSize, this.y_cor[i] * this.tileSize, this.tileSize, this.tileSize);
    }
    return this;
  }

  move() {
    // without this scope is in betwen {} so we need

  }

  turn(direction) {
    for (let i = 0; i < this.num_segments - 1; i++) {
      this.x_cor[i] = this.x_cor[i + 1];
      this.y_cor[i] = this.y_cor[i + 1];
    }
    switch (direction) {
      case 39: // right
        this.x_cor[this.num_segments-1] = this.x_cor[this.num_segments - 2] + this.tileSize;
        this.y_cor[this.num_segments-1] = this.y_cor[this.num_segments - 2];
      /*
        this.vx = Math.cos(this.angle * (Math.PI / 180))
        this.x += this.vx;*/
        break;
      case 37: // left
        this.x_cor[this.num_segments-1] = this.x_cor[this.num_segments - 2] - this.tileSize;
        this.y_cor[this.num_segments-1] = this.y_cor[this.num_segments - 2];
        /*  this.vx = Math.cos(this.angle * (Math.PI / 180))
        this.x -= this.vx;*/
        break;
      case 40: //down
        this.x_cor[this.num_segments-1] = this.x_cor[this.num_segments - 2];
        this.y_cor[this.num_segments-1] = this.y_cor[this.num_segments - 2]  + this.tileSize;
        /*this.vy = Math.sin(this.angle * (Math.PI / 180))
        this.y += this.vy;*/
        break;
      case 38: // up
        this.x_cor[this.num_segments-1] = this.x_cor[this.num_segments - 2];
        this.y_cor[this.num_segments-1] = this.y_cor[this.num_segments - 2]  - this.tileSize;
        /*this.vy = Math.sin(this.angle * (Math.PI / 180))
        this.y -= this.vy;*/
        break;
      }
      this.num_segments++;
    }

}
/*// ----------------------------
// Tailed Child class (or subclass)
// ----------------------------

class TailedCircle extends Circle {
  constructor(x = 5, y = 5, r = 10, col = '#ffc689') {
    super(x, y, r, col);
    this.num_segments = 1;
    this.x_start = this.x;
    this.y_start = this.y;
    this.row_cor = [];
    this.col_cor = [];
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
    for (let i = 0; i < this.row_cor.length; i++) {
      // Check for this.row_cor[i + 1] so no empty variable in spot #2 (zero-based index)
      if (this.row_cor[i + 1]) {
        this.line_x[i] = Math.round(this.row_cor[i + 1]);
        this.line_y[i] = Math.round(this.col_cor[i + 1]);
        line(this.row_cor[i], this.col_cor[i], this.row_cor[i + 1], this.col_cor[i + 1]);

      }
      // endShape();
      fill(255, 204, 0, 50);
    }
    this.row_cor.push(this.x);
    this.col_cor.push(this.y);
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


*/
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
    // TODO finish logic for touching
    stroke(100);
    this.cell = {
      column: column,
      row: row,
      square: rect(column * this.tileSize, row * this.tileSize, this.tileSize, this.tileSize)
    }
    this.grid[column][row] = this.cell;
  }
}

class Player extends Grid{
  constructor(rows, cols) {
    super(rows, cols);
    this.num_segments = 2;
    this.direction = 0;
    this.x_start = 100;
    this.y_start = 250;
    this.diff = 10;
    this.rows_count = rows;
    this.cols_count = cols;
    this.row_cor = [];
    this.col_cor = [];
    this.cur_col = 1;
    this.cur_row = 1;
  }
  start() {
    this.grid[0] = [];
    this.grid[0][0] = [];
    this.col_cor.push(1);
    this.row_cor.push(1);
    return this;
  }
  render() {
      for (let column = 0; column < this.col_cor.length; column++) {

          this.grid[column] = []; // create the next row (inner array)

          for (let row = 0; row < this.row_cor.length; row++) {

              fill(100);
              stroke(0);
              rect(this.col_cor[column] * this.tileSize, this.row_cor[row] * this.tileSize, this.tileSize, this.tileSize)

          }
      }

      return this;
  }
  turn(direction) {
    switch (direction) {
      case 39: // right
        this.cur_col += 1;
        this.col_cor.push(this.cur_col);
        break;
      case 37: // left
        this.cur_col -= 1;
        this.col_cor.push(this.cur_col);
        break;
      case 40: //down
        this.cur_row +=1;
        this.row_cor.push(this.cur_row);
        break;
      case 38: // up
        this.cur_row -=1;
        this.row_cor.push(this.cur_row);
        break;
    }
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
  player = new Player(1, 1);
  grid = new Grid(10, 10);
  grid.render();

  player2 = new Circle(10, 10);
  player2.start();
  player2.draw();
}
//PROCESSING every .. seconds
function draw() {
	//clear background
	//background("#2834ff");
  grid.render();
  // player.draw().move(grid);
  player.render();
  if (player.gridTouch){
    grid.gridTouch(player, 4, 5);
  }

  player2.draw();
}
//PROCESSING every mouseclick
function mousePressed() {
	player.turn();
}
function keyPressed() {
  player2.turn(keyCode);
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
