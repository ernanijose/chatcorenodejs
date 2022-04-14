const users = [];

//usuarios que se juntam ao chat
function userJoin(id, username, room)
{
    const user = {id, username, room};

    users.push(user);

    return user;
}

//aqui é a função para pegar o usuario atual
function getCurrentUser(id)
{
    return users.find(user => user.id === id);
}

//função para quem sai do chat
function userLeave(id)
{
    const index = users.findIndex(user => user.id === id);

    if(index !== -1){
        return users.splice(index, 1)[0];
    }
}

// pegando os usuarios que estão na room
function getRoomUsers(room)
{
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
}