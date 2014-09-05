var socket = io.connect('/');
var userId;
var videoUserId;
$(function(){
	$('.buttons button').click(function(){
		console.log('reaccionando...:'+videoUserId);
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
		$('.users').empty();
		for (var i = 0; i < data.length; i++) {
			if(data[i].id != userId){
				$('.users').append('<li class="'+data[i].id+'">'+data[i].name+'</li>');
			}
		}
	});
	$('body').on('click','.users li',function(e){

		videoUserId = $(this).attr('class');
		console.log('videoUserId:'+videoUserId);
		$('.users').hide();
		$('.reactions').show();
	});
	socket.on('push',function(data){
		console.log('recibiendo push en el cliente');
		$('#message').append('<li>'+ data.user +' te ha enviado un ' + data.reaction + ' </li>');
	});
	$('.atras').on('click',function(){
		$('.users').show();
		$('.reactions').hide();
	});

});

