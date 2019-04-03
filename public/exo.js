let socket = io.connect('http://localhost:3000');
	
var numberOfTasks = 0;

let pseudo = prompt("Veuillez choisir un pseudo svp ");

socket.emit('nouvelle connexion', pseudo);
	
socket.on('wellcome', (data) => {
	notifyToUser(data.message);
	let todoList = data.list;
	numberOfTasks = todoList.length;
	$('small').html(`(${numberOfTasks} tâches)`);
		if(numberOfTasks>0) {
			todoList.map((listItem => {
				let content = `<li><button class="btn btn-danger mr-2" onclick="deleteTask(window.event)">X</button>${listItem}</li>`
				$('#message').append(content);
			}))
		}
})

socket.on('userList', (list) => {
	$('#users').empty();
	list.map(user => {
		$('#users').append(`<li>${user}</li>`);
	})
})

socket.on('new comer', (data) => {
	let msg = `${data} à ${formatTime()}`;
	notifyToUser(msg);
})

socket.on('addTask', (data) => {
		let content = `<li><button class="btn btn-danger mr-2" onclick="deleteTask(window.event)">X</button>${data.data}</li>`
		$('#message').append(content);
		$('small').html(`(${data.numberOfTasks} tâches)`);
})

socket.on('deleteTask', (data) => {
	let ul = document.getElementById('message')
	let liToRemove = ul.childNodes[data.index];
	ul.removeChild(liToRemove);
	$('small').html(`(${data.numberOfTasks} tâches)`);
})

socket.on('disconnected', (data) => {
	$('#users').empty();
	data.users.map(user => {
		$('#users').append(`<li>${user}</li>`);
	})
	let msg = `${data.message} à ${formatTime()}`;
	notifyToUser(msg);
})

function deleteTask(e) {
	let delet = confirm('Voulez=vous vraiment supprimer cette tâche ?')
	if(delet) {
		let li = e.target.closest('li');
		let nodes = Array.from(li.closest('ul').children)
		let indexToDelete = nodes.indexOf(li)

		socket.emit('deleteTask', indexToDelete);
	}
	
}

function sendMessage() {
	let message = document.getElementById('message_input').value;
	if(message.length>0) {
		document.getElementById('message_input').value="";
		socket.emit('addTask', message);
	} else alert('Veuillez entrer une tâche svp !')	
}

function notifyToUser(msg) {
	$('#notification').html(`<p class="notification"> ${msg}</p>`);
	setTimeout(() => $('#notification').html(""), 3000);
}

function formatTime() {
	d = new Date();
	let minutes = d.getUTCMinutes();
	let hours = d.getUTCHours();
	let displayedMinutes = minutes<10 ? `0${minutes}` : minutes;
	let displayedHours = hours<10 ? `0${hours}` : hours;
	return `${displayedHours}:${displayedMinutes}`
}

