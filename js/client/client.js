var socketio = io.connect("127.0.0.1:1337");
var whoAmI = '';
var toWhom = 'All'; //Stores the selected contact to send messages to.
var maxScrollValue = 0;

socketio.on('disconnect', function(){
    $('body').empty().append('<p class="serverDownMessage">Oops! Server is Resting Peacefully!</p>')
});

socketio.on("userListInit", function(data){
    $('.myUsername').append('<p class="pull-right">'+whoAmI+'</p>');
    $('.contacts').empty().append('<li class="contact_name selected_contact" value="All"><i class="glyphicon glyphicon-user"> </i> All<i class="notify pull-right glyphicon glyphicon-envelope"> </i></li>');
    $('.chatContent').empty().append('<div class="All selected_content contact_content"></div>');
    $.each(data['userList'], function(index, uname){
        if(uname == whoAmI) return true;
        $('.contacts').append('<li class="contact_name" value="'+uname+'"><i class="glyphicon glyphicon-user"></i> '+uname+'<i class="notify pull-right glyphicon glyphicon-envelope"> </i></li>');
        $('.chatContent').append('<div class="'+uname+' hide_content contact_content"></div>');
    });
});

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
    $('.chatContent .'+msgDiv).html($('.chatContent .'+msgDiv).html() + "<hr/>" + "<p class='"+msgClass+"'><span class='unameChat'>"+data['fromWhom']+": "+"</span>" + "<span>"+data['message']+"</span></p>");
    if($('.chatContent .'+msgDiv).height() > maxScrollValue){
        maxScrollValue = $('.chatContent .'+msgDiv).height();
    }
    $('.chatContent').scrollTop($('.chatContent').scrollTop() + maxScrollValue);
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
        $('.contacts').append('<li class="contact_name" value="'+data['username']+'"><i class="glyphicon glyphicon-user"></i> '+data['username']+'<i class="notify pull-right glyphicon glyphicon-envelope"> </i></li>');
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