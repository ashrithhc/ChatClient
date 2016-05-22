socketio.on("userListInit", function(data){
    $('.myUsername').append('<p class="pull-right">Welcome, '+whoAmI+'</p>');
    $('.contacts').empty().append('<li class="contact_name selected_contact" value="All"><i class="glyphicon glyphicon-user"> </i> All<i class="notify pull-right glyphicon glyphicon-envelope"> </i></li>');
    $('.chatContent').empty().append('<div class="All selected_content contact_content"></div>');
    $.each(data['userList'], function(index, uname){
        if(uname == whoAmI) return true;
        $('.contacts').append('<li class="contact_name" value="'+uname+'"><i class="glyphicon glyphicon-user"></i> '+uname+'<i class="notify pull-right glyphicon glyphicon-envelope"> </i></li>');
        $('.chatContent').append('<div class="'+uname+' hide_content contact_content"></div>');
    });
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

$(document).ready(function(){
    $('body').on('click', '.contact_name', function(){
        $(this).children('.notify').hide();
        toWhom = $(this).attr('value');
        $('.contact_name').removeClass('selected_contact');
        $(this).addClass('selected_contact');
        $('.contact_content').addClass('hide_content').removeClass('selected_content');
        $('.chatContent .'+toWhom).addClass('selected_content').removeClass('hide_content').show();
    });
});