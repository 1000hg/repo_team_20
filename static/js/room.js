
var socket = io()

socket.emit('getroom')

var dir = document.querySelector(".Room")

socket.on('rooms', function(data){
    console.log(data)
    data.forEach(function(x){
        dir.innerHTML += `<div class="Room-Chating">
            <input type="button" value="${x.name}" id="Room-join-btn" onclick="location.href += 'room?${x.id}'">					
        </div>	`
    })
})