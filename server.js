// Server-side code
console.log('Server-side code running');
const express = require('express'); // imports express
const app = express(); // sets up an (express) app
const server = require('http').Server(app); // creates http server which is using (express) app
const io = require('socket.io')(server); // import socket and make it available to the server
const MongoClient = require('mongodb').MongoClient; // import mongo and create mongo client
const bodyParser = require('body-parser'); // import body parser (to use in req.body)

// define directiories which are exposed to web
app.use(express.static(__dirname + '/node_modules'));
// serve files from the public directory
app.use(express.static('public'));
app.use(bodyParser.json()); // body parser to support JSON-encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // to support URL-encoded bodies

let db;
const url = 'mongodb://localhost:27017/players'; // db url
// connect to the db and start the express server
MongoClient.connect(url, (err, database) => {
  if(err) { return console.log(err); }
  db = database;
  // start the express web server listening on 8080
  server.listen(8000, () => {
    console.log('Well done, now I am listening on ', server.address().port);
  });
});

// ROUTING
// serve the homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});
// serve the game page
app.get('/game', (req, res) => {
  res.sendFile(__dirname + '/public/game.html');
});

// add a document to the DB collection recording the player event
app.post('/leaderboardUpdate', (req, res) => {
  // assign request body values to the player
  const player = {
    username: req.body.nickname,
    score: req.body.score,
    time: new Date()
  };
  // create players collection and saves entry if user name does not exist otherwise updates
  db.collection('players').update( { username: player.username }, player, { upsert:true }, (err, result) => {
    if (err) { return console.log(err); }
    console.log('user added to db');
    // after saving redirect user to the index page
    res.redirect('/');
  });
});

// get the player data from the database
app.get('/players', (req, res) => {
  // find entries in the database, sort it on score and limit to first six
  // find returns cursor so we need to use toArray method
  db.collection('players').find().sort({'score': -1}).limit(6).toArray((err, result) => {
    if (err) return console.log(err);
    // send result to the client
    res.send(result);
  });
});

// socket.io
let all_players = []; // hold players data
// on client connection
io.on('connection', (client) => {
  console.log(`io.on connection: ${client.id}`);
  // update all clients with new player data
  client.on('newPlayer', function(data) {
    all_players.push(data); // add new payer to array
    client.emit('playersList', all_players ); // emmit all_players array
    client.broadcast.emit('updatedPlayersList', all_players );
  });
  // updating players positions on canvas
  client.on('updateOpponents', function(player) {
    for (let i = 0; i < all_players.length; i++) {
      if (all_players[i].id === player.id) {
        all_players[i] = player;
      }
    }
    client.broadcast.emit('updatedPlayersPosition', all_players);
  });
  // deleting player from array when lost
  client.on('playerLost', function(player) {
    num_players = -1;
    for (let i = 0; i < all_players.length; i++ ) {
      if(all_players[i].id === player.id) {
        // redirect client to the home page
        client.to(player.id).emit('youLost', '/index.html');
        all_players.splice(i, 1); //delete from array
        client.emit('updatedPlayersList', all_players); // sending updated array to clients
      }
    }
  });
  // deleting disconnected client
  client.on('disconnect', function() {
    num_players = -1;
    //checking which player disconnected and deleting him from an array
    for (let i = 0; i < all_players.length; i++ ) {
      if(all_players[i].id === client.id) {
        all_players.splice(i, 1); //delete from array
        client.emit('updatedPlayersList', all_players); // updating
      }
    }
  });
});
