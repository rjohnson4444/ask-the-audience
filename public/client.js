var socket = io();

var connectionCount = document.getElementById('connection-count');

socket.on('usersConnected', (count) => {
    connectionCount.innerText = `Connected Users: ${count}.`;
});

var statusMessage = document.getElementById('status-message');

socket.on('statusMessage', (message) => {
    statusMessage.innerText = message;
});

var buttons = document.querySelectorAll('#choices button');
var currentVote = document.getElementById('current-vote')

for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', (e) => {
        socket.send('voteCast', e.target.innerText);
        currentVote.innerText = `You picked: ${e.target.innerText}`
    });
}

var currentVoteCount = document.querySelectorAll('#vote-count li');

socket.on('voteCount', (votes) => {
    var voteLetters = ["A", "B", "C", "D"]

    for (let i = 0; i < voteLetters.length; i++) {
        vote = `${voteLetters[i]}: ${votes[voteLetters[i]]}`
        currentVoteCount.item(i).innerText = vote
    }
});


