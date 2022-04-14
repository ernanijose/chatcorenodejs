const chatForm = document.getElementById('chat-form');
//aqui eu pego a div com a classe ou id para poder a cada mensagem enviada ele abaixando o scroll da tela
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//pegando o username e a room da url
const { username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

//pegando os usuarios e as salas ativas
socket.on('roomUsers', ({ room, users}) => {
    outputRoomName(room);
    outputUsers(users);
});

//usuario se juntando a sala de batepapo
socket.emit('joinRoom', {username, room});

//Mensagem enviado pelo servidor
socket.on('message', message => {
    console.log(message);    
    outputMessage(message);

    //Aqui se faz a parte para a mensagem abaixar o scrool da div
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Mensagem enviado pelo chat-form
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const msg = e.target.elements.msg.value;

    //Enviando mensagem para o servidor socket
    socket.emit('chatMessage', msg);

    //aqui é para limpar o input de onde enviou a mensagem
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});


//Agora aqui é que faz magica de modifica o DOM do HTML
function outputMessage(message)
{
    //aqui vai criar uma nova div
    const div = document.createElement('div');
    //aqui coloca a classe message na nova div criada
    div.classList.add('message');
    //aqui eu incluo todo o html que preciso dentro da div criada com a classa message
    div.innerHTML = `
    <div class="message">
        <p class="meta">${message.username} <span>${message.time}</span></p>
        <p class="text">
            ${message.text}
        </p>
    </div>
    `;
    //aqui informo que será nessa div que vou colocar o novo conteudo
    document.querySelector('.chat-messages').appendChild(div);
}

// adicionando o nome da salas ao DOM do HTML
function outputRoomName(room)
{
    roomName.innerText = room;
}

// adicionando os nomes do usuarios que estão na sala
function outputUsers(users)
{
    userList.innerHTML = `
        ${users.map(user => `
            <li>${user.username}</li>
        `).join('')}
    `;
}