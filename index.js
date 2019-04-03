const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = 3000;

var todoList = [];
var users = [];

server.listen(port, () => {
	console.log(`Server listening on port ${port}`)
})

app.use(express.static('public'))
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/index.html');
})

io.on('connection', (socket, pseudo) => {
	socket.on('nouvelle connexion', (pseudo) => {
		socket.pseudo = pseudo;
		users.push(socket.pseudo);
		socket.emit('wellcome', {message: `Bienvenu ${socket.pseudo}`, list: todoList});
		socket.broadcast.emit('new comer', `${socket.pseudo} vient de se connecter`);
		io.emit('userList', users);
	})

	socket.on('addTask', (data) => {
			todoList.push(data);
			io.emit('addTask', {numberOfTasks: todoList.length, data:data});
	})

	socket.on('deleteTask', (index) => {
			todoList.splice(index, 1);
			io.emit('deleteTask', {numberOfTasks: todoList.length, index:index});
	})

	socket.on('disconnect', () => {
			let index = users.indexOf(socket.pseudo);
			users.splice(index, 1);
			socket.broadcast.emit('disconnected', {users: users, message: `${socket.pseudo} s'est déconnecté`})
	})
})

