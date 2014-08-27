var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);


/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var debug = require('debug')('tutorial_socketio');
//var app = require('../app');


/*
var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});*/
//module.exports = app;



//socket.io
var server = http.createServer(app);
server.listen(app.get('port'),function(){
    console.log('Iniciado el servidor en el puerto 3000');
});

var io = require('socket.io').listen(server);


//push notification
var users = [];
var user = {
    id:1,
    name:''
}
var id = 0;
io.sockets.on('connection',function(socket){
    //var id = users.push(socket);
    id++;
    console.log('usuario '+id);
    user.id = id;
    user.name = 'user'+id;
    users.push(user);
    
    socket.emit('sesion',{
        id:user.id,
        name:user.name
    });
    //console.log(users.length+' usuarios conectados');
    socket.emit('users',users);
    console.log('user:' + users[id-1]);
    socket.on('push',function(data){
        console.log('se ha recibido un ' + data.reaction + ' ' + data.videoUserId);  
        users[data.videoUserId-1].emit('push',{reaction:data.reaction,user:user.name});
    });

    
});