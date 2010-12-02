var express = require('express'),
  io = require ('socket.io'),
  emitter = new(require('events').EventEmitter),
  clients = {},
  app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyDecoder());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.staticProvider(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
  res.render('index', {
    locals: {
      title: 'Chat'
    }
  });
});

// Only listen on $ node app.js

if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port)
  
  var socket = io.listen(app);
  socket.on('connection', function(client){
    emitter.emit('join', client, socket);
    
    client.on('message', function(msg){
      emitter.emit('message', client, socket, msg);
    });
    client.on('disconnect', function(){
      delete clients[client.sessionId];
    });
  });  
}






emitter.on('message', function(client, socket,  msg){
  socket.broadcast({type:'message', user:client.sessionId, msg:msg});
});

emitter.on('join', function(client, socket){
  client.send({type:'userlist', users:Object.keys(clients)});
});

emitter.on('join', function(client, socket){
  clients[client.sessionId] = client; 
  client.send({type:'message', user:'SERVER', msg:"Welcome to #node-chat"});
});

emitter.on('join', function(client, socket){
    socket.broadcast({type:'join', 
                      user:client.sessionId, 
                      msg:client.sessionId +' has joined'}, client);

});
