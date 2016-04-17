var socketio = io.connect("127.0.0.1:1337");
var whoAmI = '';
var toWhom = 'All'; //Stores the selected contact to send messages to.

socketio.on("userListInit", function(data){
    $('.contacts').empty().append('<li class="contact_name selected_contact" value="All"><i class="glyphicon glyphicon-user"> </i> All</li>');
    $('.chatContent').empty().append('<div class="All selected_content contact_content"></div>');
    $.each(data['userList'], function(index, uname){
        $('.contacts').append('<li class="contact_name" value="'+uname+'"><i class="glyphicon glyphicon-user"></i> '+uname+'</li>');
        $('.chatContent').append('<div class="'+uname+' hide_content contact_content"></div>');
    });
});

socketio.on("message_to_client", function(data) {
    if (data['fromWhom'] == whoAmI){
        var msgClass = 'messageRight';
        var msgDiv = data['toWhom'];
    }
    else if (data['toWhom'] == 'All'){
        var msgClass = 'messageLeft';
        var msgDiv = data['toWhom'];
    }    
    else {
        var msgClass = 'messageLeft';
        var msgDiv = data['fromWhom'];
    }
    $('.chatContent .'+msgDiv).html($('.chatContent .'+msgDiv).html() + "<hr/>" + "<p class='"+msgClass+"'><span class='unameChat'>"+data['fromWhom']+": "+"</span>" + "<span>"+data['message']+"</span></p>");
});

socketio.on("usernameVerify", function(data){
    if(data['message']){
        $('.modal').css('display', 'none');
        $('.container').show();
        whoAmI = data['username'];
    }
});

socketio.on("userListChange", function(data){
    if(data['action'] == 'add'){
        $('.contacts').append('<li class="contact_name" value="'+data['username']+'"><i class="glyphicon glyphicon-user"></i> '+data['username']+'</li>');
        $('.chatContent').append('<div class="'+data['username']+' hide_content contact_content"></div>');
    }
    else if(data['action'] == 'delete'){
        $('.contacts [value="'+data['username']+'"]').remove();
        $('.chatContent .'+data['username']).remove();
        if(toWhom == data['username']){
            toWhom = 'All';
            $('.contacts [value="All"]').addClass('selected_contact');
            $('.chatContent .All').removeClass('hide_content'),addClass('selected_content');
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
        $('.contact_content').addClass('hide_content').removeClass('selected_content');
        $('.chatContent .'+toWhom).addClass('selected_content').removeClass('hide_content').show();
    });

    $('#sendButton').on('click', function(){
        var msg = $('#messageInput').val();
        var toVal = toWhom;
        socketio.emit("message_to_server", { message : msg, toWhom : toVal});
        $('#messageInput').val('');
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