var socketio = io.connect("127.0.0.1:1337");
var whoAmI = '';
var toWhom = 'All'; //Stores the selected contact to send messages to.
var maxScrollValue = 0;

socketio.on('disconnect', function(){
    $('body').empty().append('<p class="serverDownMessage">Oops! Server is Resting Peacefully!</p>');
});
