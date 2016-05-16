$(document).ready(function(){
    $('#nameButton').on('click', function(){
        name = $('#nameInput').val();
        socketio.emit("client_identity", {username : name});
        setTimeout(function(){
            $('#messageInput').focus();
        }, 0);
    });

    $('body').on('click', '.contact_name', function(){
        $(this).children('.notify').hide();
        toWhom = $(this).attr('value');
        $('.contact_name').removeClass('selected_contact');
        $(this).addClass('selected_contact');
        $('.contact_content').addClass('hide_content').removeClass('selected_content');
        $('.chatContent .'+toWhom).addClass('selected_content').removeClass('hide_content').show();
    });

    $('#sendButton').on('click', function(){
        var msg = $('#messageInput').text();
        var toVal = toWhom;
        socketio.emit("message_to_server", { message : msg, toWhom : toVal});
        $('#messageInput').text('');
        $('#toWhomInput').val('');
    });

    $('#clearButton').on('click', function(){
        $('.chatContent .'+toWhom).empty();
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