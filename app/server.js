var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var redis = require('redis');

io.on('connection', (socket) => {

  //Inicializando lib 'redis'
  var redisClient = redis.createClient();

  //Definindo o channel das mensagens
  socket.on("enterChannel", (data) => {
    redisClient.subscribe(data.channel);
  });

  //Adicionando Mensagem e emitindo evento com dados
  redisClient.on("message", (channel, message) => {
    socket.emit('addMessage', message );
  });

  //Desconectando do channel
  socket.on('disconnect', function () {
    redisClient.quit();
  });

});

var port = 8890;

server.listen(port, function () {
  console.log('listening in http://localhost:' + port);
});