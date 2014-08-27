var socket = io.connect('/');
var userId;
var videoUserId;
$(function(){
	$('button').click(function(){
		console.log('socket:'+socket);
		var reaction = $(this).attr('class');
		socket.emit('push',{reaction:reaction,videoUserId:videoUserId});
	});
	socket.on('sesion',function(data){
		userId = data.id;
		userName = data.name;
		$('.users').show();
		$('.reactions').hide();
	});
	socket.on('users',function(data){
		console.log('usuarios');
		for (var i = 0; i < data.length; i++) {
			console.log('idddddddd:'+data[i].id);
			if(data[i].id != userId){
				$('.users').append('<li class="'+data[i].id+'">'+data[i].name+'</li>');
			}
		}
	});
	$('body').on('click','.users li',function(e){
		console.log('eligiendo usuario');
		videoUserId = $(this).attr('class');
		console.log('videoUserId:'+videoUserId);
		$('.users').hide();
		$('.reactions').show();
	});
	socket.on('push',function(data){
		$('#message').append('<li>'+ data.user +' te han enviado un ' + data.reaction + ' </li>');
	});

});

