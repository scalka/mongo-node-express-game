//set up server
console.log('Server-side code running');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const MongoClient = require('mongodb').MongoClient;

// serve files from the public directory
// define directiories which are exposed to web
app.use(express.static(__dirname + '/node_modules'));
app.use(express.static('public'));

// connect to the db and start the express server
let db;

// Replace the URL below with the URL for your database
//const url =  'mongodb://user:password@mongo_address:mongo_port/clicks';
const url = 'mongodb://localhost:27017/clicks';
MongoClient.connect(url, (err, database) => {
  if(err) {
    return console.log(err);
  }
  db = database;
  // start the express web server listening on 8080
  /*  app.listen(8080, () => {
    console.log('listening on 8080');
  });*/
  server.listen(8000, () => {
    console.log('Well done, now I am listening on ', server.address().port);
  });
});

// ROUTING
// serve the homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/game', (req, res) => {
  res.sendFile(__dirname + '/public/game.html');
});

// add a document to the DB collection recording the click event
app.post('/clicked', (req, res) => {
  const click = {clickTime: new Date()};
  console.log(click);
  console.log(db);

  db.collection('clicks').save(click, (err, result) => {
    if (err) {
      return console.log(err);
    }
    console.log('click added to db');
    res.redirect('/');
  });
});

// get the click data from the database
app.get('/clicks', (req, res) => {
  db.collection('clicks').find().toArray((err, result) => {
    if (err) return console.log(err);
    res.send(result);
  });
});

// socket.io

let all_players = [];
let points = 0;

io.on('connection', (client) => {
  console.log('io.on connection');

  client.on('newPlayer', function(data) {
    console.log('newPlayer connection:' + data);
    all_players.push(data);
    client.emit('playersList', all_players );
    client.broadcast.emit('updatedPlayersList', all_players );
  });

  client.on('updateOpponents', function(player) {
    //console.log(player);
    for (let i = 0; i < all_players.length; i++) {
      if (all_players[i].id === player.id) {
        all_players[i] = player;
      }
    }
    client.broadcast.emit('updatedPlayersPosition', all_players);
  });

  client.on('playerLost', function(player) {
    num_players = -1;
    for (let i = 0; i < all_players.length; i++ ) {
      if(all_players[i].id === player.id) {
        //delete from array

        io.to(player.id).emit('youLost', '/index.html');
        all_players.splice(i, 1);
        io.emit('updatedPlayersList', all_players);
      }
    }
  });

  //disconnected client
  client.on('disconnect', function() {
    num_players = -1;
    //checking which player disconnected and deleting him from an array
    for (let i = 0; i < all_players.length; i++ ) {
      if(all_players[i].id === client.id) {
        //delete from array
        all_players.splice(i, 1);
        io.emit('updatedPlayersList', all_players);
      }
    }
  });
});
