$(function(){
  var socket = new io.Socket();
  socket.connect();
  
  socket.on('message', function(msg){
    $(document).trigger('/chat/' + msg.type, [msg]);
  });
  socket.on('error', function(err){
    console.log(err);
  });
  socket.on('disconnect', function(){
    $('#screen').append("Connection has been terminated");
  });
   
  $('#send').click( function(){
    var textToSend = $('#user-input').val();
    socket.send(textToSend);
    $('#user-input').val('');
    
  });

  on('/chat/join', function(e, evt){
    console.log(evt);
    $('#user').append(evt.user + "<br>");
  });
  
  on('/chat/message', function(e, evt){
    $('#screen').append('['+evt.user + '] ' + evt.msg+"<br>");
  });
  
  on('/chat/userlist', function(e, evt){
    evt.users.forEach(function(user){
      $('#user').append(user + "<br>");
    });

  });
  
  
});
var on = function(name, handler){
  $(document).bind(name, handler);
  
}
