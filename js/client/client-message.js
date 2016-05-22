socketio.on("message_to_client", function(data){
    if (data['fromWhom'] == whoAmI){
        var msgClass = 'messageRight LastMessage';
        var msgDiv = data['toWhom'];
    }
    else {
        if (data['toWhom'] == 'All'){
            var msgDiv = data['toWhom'];
        }
        else {
            var msgDiv = data['fromWhom'];
        }
        $('.contact_name').each(function(){
            if( $(this).attr('value') == msgDiv ){
                $(this).children('.notify').show();
            }
        });
        var msgClass = 'messageLeft LastMessage';
    }
    $('.chatContent .'+msgDiv+' p').removeClass('LastMessage');
    $('.chatContent .'+msgDiv).html($('.chatContent .'+msgDiv).html() + "<p class='"+msgClass+"'><span class='unameChat'>"+data['fromWhom']+": "+"</span>" + "<span>"+data['message']+"</span></p>");
    if($('.chatContent .'+msgDiv).height() > maxScrollValue){
        maxScrollValue = $('.chatContent .'+msgDiv).height();
    }
    $('.chatContent').scrollTop($('.chatContent').scrollTop() + maxScrollValue);
});

$(document).ready(function(){
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

    $('#messageInput').keypress(function(e){
        var key = e.which;
        if(key == 13) {
            $('#sendButton').click();
            return false;
        }
    });
});