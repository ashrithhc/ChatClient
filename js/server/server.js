var http = require('http'),
    fs = require('fs'),
    path = require('path'),
    url = require('url'),
    validator = require('validator');

var usernames = {},
    users_list = [];

var app = http.createServer(function (request, response) {
    var pathname = url.parse(request.url).pathname;
    if(pathname === '/'){
        fs.readFile("../../layouts/client.html", "utf-8", function(error, data){
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write(data);
            response.end();
        });
    }
    else if(pathname === '/favicon.ico'){
        console.log("favicon died");
    }
    else {
        var script = fs.readFileSync("../../" + pathname.substring(1, pathname.length), "utf8");
        response.writeHead(200, contentType(path.extname(pathname)));
        response.write(script);
        response.end();
    }
}).listen(1337);
 
var io = require('socket.io').listen(app);
 
io.sockets.on('connection', function(socket) {
    socket.on('message_to_server', function(data) {
    	var escaped_message = validator.escape(data['message']);
        io.sockets.emit("message_to_client", {message : usernames[socket.id] + ': ' + escaped_message});
    });

    socket.on('client_identity', function(data){
        var escaped_message = validator.escape(data['username']);
        if(users_list.indexOf(escaped_message) > -1){
            socket.emit("usernameVerify", {message : false});
        }
        else {
            users_list.push(escaped_message);
            usernames[socket.id] = escaped_message;
            socket.emit("usernameVerify", {message : true});
        }
    });

    socket.on('disconnect', function(){
        if (usernames[socket.id]){
            io.sockets.emit("message_to_client", {message : usernames[socket.id] + ' IS DISCONNECTED'});
            delete usernames[socket.id];
        }
    });
});

function contentType(ext){
    var ct;

    switch (ext){
        case '.html':
            ct = 'text/html';
            break;
        case '.css':
            ct = 'text/css';
            break;
        case '.js':
            ct = 'text/javascript';
            break;
        default:
            ct = 'text/plain';
            break;
    }
    return {'Content-Type' : ct}
}