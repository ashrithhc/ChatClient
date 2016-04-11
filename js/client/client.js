var socketio = io.connect("127.0.0.1:1337");

socketio.on("message_to_client", function(data) {
    $('#chatlog').html($('#chatlog').html() + "<hr/>" + data['message']);
});

socketio.on("usernameVerify", function(data){
    if(data['message']){
        $('.modal').css('display', 'none');
        $('#container').show();
    }
});

$(document).ready(function(){
    $('#nameButton').on('click', function(){
        name = $('#nameInput').val();
        socketio.emit("client_identity", {username : name});
    });

    $('#sendButton').on('click', function(){
        var msg = $('#messageInput').val();
        var toVal = $('#toWhomInput').val();
        socketio.emit("message_to_server", { message : msg, toWhom : toVal});
        $('#messageInput').val('');
        $('#toWhomInput').val('');
    });

/*    $('#nameForm').validate({
        rules:{
            "nameInput": {
                required: true,
                regex: "^([a-zA-Z0-9-_])*$"
            }
        },
        messages: {
            nameInput:{
                required: "Please provide a username",
                regex: "Not more than one word"
            }
        }
    });*/

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