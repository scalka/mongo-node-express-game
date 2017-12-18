console.log('Client-side code running');
// PROCESSING START
// Circle - Player class
let player;
function Circle(x = 50, y = 50, r =10, col = '#ffc689')  {
	this.x = x;
	this.y = y;
	this.r = r;	this.col = col;
	this.vx = random(1, 5);
	this.vy = random(1, 5);
}
Circle.prototype.move = function () {
	//without this scope is in betwen {} so we need
	this.x += this.vx;
	this.y += this.vy;
  console.log(this.x this.y);
};

Circle.prototype.draw = function () {
	fill(this.col);
	ellipse(this.x, this.y, this.r)
};

//at start
function setup() {
	createCanvas(500, 500);
	background("#ffffff");
  player = new Circle(mouseX, mouseY, 50);
}
// every .. seconds
function draw() {
	//clear background
	background("#2834ff");
	player.draw();

}

function mousePressed() {
	player.move();
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
