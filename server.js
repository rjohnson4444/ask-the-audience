const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
var votes = {};

const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

const port = process.env.PORT || 3000;
const server = http.createServer(app);

server.listen(port, () => {
     console.log('Listening on port ' + port + '.');
});

const io = socketIo(server);

io.on('connection', (socket) => {
    console.log('A user has connected.', io.engine.clientsCount);

    io.sockets.emit('usersConnected', io.engine.clientsCount);

    socket.emit('statusMessage', 'You have connected.');

    socket.on('message', (channel, message) => {
        if (channel === 'voteCast') {
            votes[socket.id] = message;
            io.sockets.emit('voteCount', countVotes(votes))
        }
    });

    socket.on('disconnect', () => {
        console.log('A user has disconneted', io.engine.clientsCount);
        delete votes[socket.id];
        socket.emit('voteCount', countVotes(votes));
        socket.emit('usersConnected', io.engine.clientsCount);
    });

});

function countVotes(votes) {
    var voteCount = {
        A: 0,
        B: 0,
        C: 0,
        D: 0
    };
        for (var vote in votes) {
            voteCount[votes[vote]]++
        }
        return voteCount;
}

module.exports = server;
