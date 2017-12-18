/*
.emit Sends messages between server-client(s).
.on Handles incoming messages
*/
console.log('Client-side code running');
// PROCESSING START
// Circle - Player class
let player;
function Circle(x = 50, y = 50, r =10, col = '#ffc689')  {
	this.x = x;
	this.y = y;
	this.r = r;	
  this.col = col;
	this.angle = 25;
  this.speed = 1;
}
Circle.prototype.move = function () {
  //without this scope is in betwen {} so we need
  this.vx = Math.cos(this.angle*Math.PI/180) * this.speed;
  this.vy = Math.sin(this.angle*Math.PI/180) * this.speed;
	this.x += this.vx;
	this.y += this.vy;
};
Circle.prototype.turn = function () {
  this.angle += 25;
  console.log(this.angle);
}
Circle.prototype.draw = function () {
	fill(this.col);
	ellipse(this.x, this.y, this.r)
};

//PROCESSING at start
function setup() {
	createCanvas(1000, 1000);
	background("#ffffff");
  player = new Circle(mouseX, mouseY, 50);
}
//PROCESSING every .. seconds
function draw() {
	//clear background
	background("#2834ff");
  player.move();
	player.draw();

}
//PROCESSING every .. seconds
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
