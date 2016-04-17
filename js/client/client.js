var socketio = io.connect("127.0.0.1:1337");
var toWhom = 'All'; //Stores the selected contact to send messages to.

socketio.on("userListInit", function(data){
    $('.contacts').empty().append('<li class="contact_name selected_contact" value="All"><i class="glyphicon glyphicon-user"> </i> All</li>');
    $.each(data['userList'], function(index, uname){
        $('.contacts').append('<li class="contact_name" value="'+uname+'"><i class="glyphicon glyphicon-user"></i> '+uname+'</li>');
    });
});

socketio.on("message_to_client", function(data) {
    $('#chatlog').html($('#chatlog').html() + "<hr/>" + data['message']);
});

socketio.on("usernameVerify", function(data){
    if(data['message']){
        $('.modal').css('display', 'none');
        $('.container').show();
    }
});

socketio.on("userListChange", function(data){
    if(data['action'] == 'add'){
        $('.contacts').append('<li class="contact_name" value="'+data['username']+'"><i class="glyphicon glyphicon-user"></i> '+data['username']+'</li>');
    }
    else if(data['action'] == 'delete'){
        $('.contacts [value="'+data['username']+'"]').remove()
        if(toWhom == data['username']){
            toWhom = 'All';
            $('.contacts [value="All"]').addClass('selected_contact');
        }
    }
});

$(document).ready(function(){
    $('#nameButton').on('click', function(){
        name = $('#nameInput').val();
        socketio.emit("client_identity", {username : name});
    });

    $('body').on('click', '.contact_name', function(){
        toWhom = $(this).attr('value');
        $('.contact_name').removeClass('selected_contact');
        $(this).addClass('selected_contact');
    });

    $('#sendButton').on('click', function(){
        var msg = $('#messageInput').val();
        var toVal = toWhom;
        socketio.emit("message_to_server", { message : msg, toWhom : toVal});
        $('#messageInput').val('');
        $('#toWhomInput').val('');
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