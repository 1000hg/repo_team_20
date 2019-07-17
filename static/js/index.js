
var socket = io()

var name;

var ddd;

function load(){
   ddd = document.getElementById('ddd')
}

var you_msg = `<div class="you-message">
<div class="message-wrap">
    <div class="message-photo">
        <img src="https://img.icons8.com/ios/50/000000/name.png">
    </div>
    <div class="message-content">
        <span>%s</span>
    </div>
</div>
</div>`

var my_msg = `                        <div class="my-message">
<div class="message-wrap">
    <div class="my-message-content">
        <span>%s</span>
    </div>

</div>
</div>

`

socket.on('update',function(data){
    if(data.name){
        if(data.name == name){
            ddd.innerHTML += my_msg.replace('%s', data.msg)
        }
        else{
            ddd.innerHTML += you_msg.replace('%s', data.msg)
        }

    }
    else{
        console.log(`${data.msg}`)
    }
})

function send(){
    var input = document.querySelector("#text-content")
    var data = input.value
    input.value = ''

    if(data == '') return;
    socket.emit("message",{type:'message',msg:data})
}

socket.on("connect", function(){
    name = prompt('Hello World!\nYour name please?')

    if(!name){
        name = '익명'
    }
    socket.emit('newUser', name)
    if(!location.search)
    {
        makeRoom()
    }
    else{
        join()
    }
})

function makeRoom(){
    var name;
    while(!name){
        name = prompt("Room name")
    }
    socket.emit("room",{name:name})
}

function join(){
    socket.emit('join', location.search.split('?')[1])
}
