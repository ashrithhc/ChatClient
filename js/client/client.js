var socketio = io.connect("127.0.0.1:1337");
var name = "nobody";

socketio.on("message_to_client", function(data) {
    $('#chatlog').html($('#chatlog').html() + "<hr/>" + data['message']);
});

$(document).ready(function(){
    $('#nameButton').on('click', function(){
        name = $('#nameInput').val();
        socketio.emit("client_identity", {username : name});
        $('#nameDiv').hide();
    });

    $('#sendButton').on('click', function(){
        var msg = $('#messageInput').val();
        $('#message_input').val('');
        socketio.emit("message_to_server", { message : msg});
        $('#messageInput').val('');
    });

    $('#nameInput').keypress(function(e){
        var key = e.which;
        if(key == 13) {
            $('#nameButton').click();
            return false;
        }
    });

    $('#messageInput').keypress(function(e){
        var key = e.which;
        if(key == 13) {
            $('#sendButton').click();
            return false;
        }
    });
});

//  /#NxkDSGDzAwmKtey7AAAB