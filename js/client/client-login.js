socketio.on("usernameVerify", function(data){
    if(data['message']){
        $('.modal').css('display', 'none');
        $('.main-container').show();
        whoAmI = data['username'];
    }
});

$(document).ready(function(){
	$('#nameButton').on('click', function(){
        name = $('#nameInput').val();
        socketio.emit("client_identity", {username : name});
        setTimeout(function(){
            $('#messageInput').focus();
        }, 0);
    });

    $('#nameInput').keyup(function(e){
        var key = e.which;
        if($(this).val() != 0)
            $('#nameButton').removeAttr('disabled');
        else
            $('#nameButton').attr('disabled', true);
    });

    $('#nameInput').keypress(function(e){
        var key = e.which;
        if(key == 13) {
            if($(this).val() != 0)
                $('#nameButton').click();
            else
                $('#errorMessageLogin').append('<p class="errorMessage">Please Choose a Username to Continue</p>');
            return false;
        }
    });
});