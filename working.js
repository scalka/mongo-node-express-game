// PROCESSING START
// Circle - Player class
let player;
// ----------------------------
// Circle Parent class (or subclass)
// ----------------------------
function Circle(x = 50, y = 50, r =10, col = '#ffc689')  {
	this.x = x;
	this.y = y;
	this.r = r;
  this.col = col;
  this.vx = random(-5, 5);
  this.vy = random(-5, 5);
	this.angle = 25;
  this.speed = 5;
}
Circle.prototype.move = function () {
  //without this scope is in betwen {} so we need
	this.x += this.vx;
	this.y += this.vy;
};
Circle.prototype.turn = function () {
  this.angle += 25;
  this.vx = Math.cos(this.angle*Math.PI/180) * this.speed;
  this.vy = Math.sin(this.angle*Math.PI/180) * this.speed;
  console.log(this.angle);
}
Circle.prototype.draw = function () {
	fill(this.col);
	ellipse(this.x, this.y, this.r);
  return this;
};
// ----------------------------
// Tailed Child class (or subclass)
// ----------------------------

function TailedCircle(x = 50, y = 50, r =10, col = '#ffc689'){
  Circle.call(this, x, y, r, col);
  this.diff = 10;
  this.num_segments = 1;
  this.x_start = this.x;
  this.y_start = this.y;
  this.x_cor = [];
  this.y_cor = [];
  this.tail = this.num_segments * rect(81, 81, 63, 63);
}
TailedCircle.prototype = Object.create(Circle.prototype);
TailedCircle.prototype.constructor = Circle;
// Override the move() method
TailedCircle.prototype.draw = function() {
  fill(this.col);
  ellipse(this.x, this.y, this.r);
  return this; // allows method chaining
};
TailedCircle.prototype.drawTail = function() {
	noFill();
	stroke(255, 0, 0);
	beginShape();
  for (var i = 0; i < this.num_segments; i++){
   //Check for this.x_cor[i + 1] so we dont get error "It looks like line() received an empty variable in spot #2 (zero-based index)
   if(this.x_cor[i + 1]){
      line(this.x_cor[i], this.y_cor[i], this.x_cor[i + 1], this.y_cor[i + 1]);
			//vertex(this.x_cor[i], this.y_cor[i]);
			//vertex(this.x_cor[i + 1], this.y_cor[i + 1]);
   }
		//endShape();
		fill(255, 204, 0, 50);
  }
  this.x_cor.push(this.x);
  this.y_cor.push(this.y);
  return this;
};
TailedCircle.prototype.move = function() {
  // reverse direction ('bounce')
  this.collision().drawTail();
  this.num_segments += 1;
  this.x += this.vx;
  this.y += this.vy;

  return this; // allows method chaining
};
TailedCircle.prototype.collision = function(obj_a, obj_b) {
  if (this.x <= 0 || this.x >= 1000 ){
    this.vx = -this.vx;
  }
  if (this.y <= 0 || this.y >= 1000){
    this.vy = -this.vy;
  }

	return this;
};


//PROCESSING at start
function setup() {
	createCanvas(1000, 1000);
	background("#ffffff");
  player = new TailedCircle(500, 500, 50);
}
//PROCESSING every .. seconds
function draw() {
	//clear background
	background("#2834ff");
  player.draw().move();

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
