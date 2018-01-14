function fetchLeaderboard() {
  const ul = document.getElementById('leaderboard_ul');


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

      players.forEach(function(player) {
        console.log(player);
        let li = document.createElement('li');
        li.innerHTML = `${player.score} ${player.username}`;
        ul.appendChild(li);
      });

    })
    .catch(function(error) {
      console.log(error);
    });
};
