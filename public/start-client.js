function fetchLeaderboard() {
  const ol = document.getElementById('leaderboard_ol');
  fetch('/players', {method: 'GET'})
    .then(function(response) {
      if(response.ok) return response.json();
      throw new Error('Request failed.');
    })
    .then(function(data) {
      console.log(data);

      let players = data;
      players.sort(function(a, b) {
        return b.score - a.score;
      });

      for(let i = 0; i < 10; i++) {
        let li = document.createElement('li');
        li.innerHTML = `${players[i].score} ${players[i].username}`;
        ol.appendChild(li);

      }
    })
    .catch(function(error) {
      console.log(error);
    });
};
