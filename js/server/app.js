var validator = require('validator');

module.exports = {

    onServerReady: function(io){
        var usernames = {}, //Maps socket ID to username
            socketids = {}, //Maps username to Socker ID
            users_list = []; //Keeps a list of all usernames

        io.sockets.on('connection', function(socket) {
            socket.on('message_to_server', function(data) {
                var escaped_message = validator.escape(data['message']);
                var toWhom = validator.escape(data['toWhom']);
                if (toWhom == 'All'){
                    io.sockets.emit("message_to_client", {toWhom: toWhom, fromWhom: usernames[socket.id], message: escaped_message});
                }
                else {
                    if(socketids[toWhom] != socket.id) socket.emit("message_to_client", {toWhom: toWhom, fromWhom: usernames[socket.id], message: escaped_message});
                    io.to(socketids[toWhom]).emit("message_to_client", {toWhom: toWhom, fromWhom: usernames[socket.id], message: escaped_message});
                }
            });

            socket.on('client_identity', function(data){
                var escaped_message = validator.escape(data['username']);
                if(users_list.indexOf(escaped_message) > -1){
                    socket.emit("usernameVerify", {message: false});
                }
                else {
                    users_list.push(escaped_message);
                    usernames[socket.id] = escaped_message;
                    socketids[escaped_message] = socket.id;
                    socket.emit("usernameVerify", {username: escaped_message, message: true});
                    socket.emit("userListInit", {userList: users_list});
                    socket.broadcast.emit("userListChange", {username: usernames[socket.id], action: 'add'});
                }
            });

            socket.on('disconnect', function(){
                if (usernames[socket.id]){
                    io.sockets.emit("userListChange", {username: usernames[socket.id], action: 'delete'});
                    users_list.splice(users_list.indexOf(usernames[socket.id]), 1);
                    delete usernames[socket.id];
                }
            });
        });
    }
}