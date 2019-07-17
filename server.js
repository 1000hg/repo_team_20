
const express = require("express")

const socket = require("socket.io")

const http = require("http")

const app = express()

const bodyParser = require('body-parser')

const qs = require('querystring')

const server = http.createServer(app)

const io = socket(server)

const fs = require("fs")

const filtering = require('./filtering')

var rooms = []

var id = 0

function find(id){
    for(let i in rooms){
        if(id == rooms[i].id){
            return rooms[i]
        }
    }
    return null
}

function listtostring(l)
{
    var result = ""
    l.slice(0,-1).forEach(function(x){
        result += x
    })
    return result
}

io.sockets.on('connect', function(socket){
    //console.log("유저 접속됨")

    socket.on("newUser",function(name){
        console.log(name + "님이 접속하셨습니다.")

        socket.name = name
    })

    socket.on('getroom',function(){
        socket.emit('rooms', rooms.map(function(x){
            return {name:x.name,uname:x.user[0].name,id:x.id}
    }))})

    socket.on('room', function(data){
        var room = {
            name:data.name,
            user:[socket],
            id:id
        }
        id += 1
        socket.room = room
        rooms.push(room)
    })

    socket.on('join', function(data){
        var room = find(data)
        if(room == null) return
        socket.room = room
        room.user.push(socket)
        room.user.forEach(function(x){
            x.emit('update',{msg:socket.name + '님이 접속하였습니다.'})
        })
    })

    socket.on('message', function(data){
        var room = socket.room
        room.user.forEach(function(x){
            x.emit('update',{name:socket.name,msg:filtering.filtering(data.msg)})
        })
    })

    socket.on("disconnect", function(){
        //console.log("접속 종료")
        if(socket.room){
        let user = socket.room.user
            let num = user.findIndex(function(x){
                return x.name == socket.name
            })
            user.pop(num)
            if(user.length == 0){
                rooms.pop(rooms.findIndex(function(x){
                    return x.name == socket.room.name
                }))
            }
            else{
                user.forEach(function(x){
                    x.emit('update',{msg:socket.name + '님이 나가셨습니다.'})
                })
            }
        }
        //socket.broadcast.emit('update', {type:'disconnect',name:'SERVER',msg: socket.name + '님이 나가셨습니다.'})
    })
})

app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(bodyParser.json())

app.use("/css", express.static("./static/css"))
app.use("/js", express.static("./static/js"))

app.get('/', function(req, res){
    fs.readFile("List.html","utf8",function(err, data){
        if(err) res.send("에러");
        res.writeHead(200, {'Content-Type':"text/html"})
        res.write(data)
        res.end()
    })
})
app.get('/room', function(req, res){
    fs.readFile("Main.html","utf8",function(err, data){
        if(err) res.send("에러");
        res.writeHead(200, {'Content-Type':"text/html"})
        res.write(data)
        res.end()
    })
})
app.get('/yok', function(req, res){
    fs.readFile("yok.html","utf8",function(err, data){
        if(err) res.send("에러");
        res.writeHead(200, {'Content-Type':"text/html"})
        res.write(data)
        res.end()
    })
})
app.post('/add',function(req, res){
    console.log(req.body.yok)
    var ddd = req.body.yok
    console.log(ddd)
    var data = fs.readFileSync('욕설 필터.txt','utf8')
    fs.writeFileSync('욕설 필터.txt', data + ',' + ddd, 'utf8')
    fs.readFile("add.html","utf8",function(err, data){
        if(err) res.send("에러");
        res.writeHead(200, {'Content-Type':"text/html; charset=UTF-8"})
        res.write(data)
        res.end()
    })
    
})

server.listen(8080,function(){
    console.log("Server is running at port 8080")
})
