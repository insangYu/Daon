var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
 
app.get('/', function(req, res){
  res.sendfile('index.html');
});
 
var userList = [];
var idList = [];
 
// io는 socket.io 패키지 import 변수, socket은 커넥션이 성공시 커넥션 정보
io.on('connection', function(socket){
  var addedUser = false; // 클라이언트와 연결이 완료시
 
  socket.on('chat message', function(msg){
 
    io.emit('chat message', {
      username: socket.username,
      message: msg
    });
    console.log(socket.username+' '+msg);
 
  });
 
  socket.on('disconnect', function(){
    if(!addedUser) return;
 
    var index = userList.indexOf(socket.username);
    userList.splice(index,1);
 
    socket.broadcast.emit('user logout',{
      username: socket.username,
      userlist: userList
    });
 
  });// ++ 퇴장시 유저목록에서 삭제시켜야함
 
  socket.on('add user',function(username){
    if(addedUser) return;
 
    addedUser = true;
    idList[username] = socket.id;
    socket.username = username;
    userList.push(username);
    var from = "admin";
    var msg = "<help>    <br>/c nickname --- change your name to nickname<br>/w reciever msg --- send your msg to reciever ";
 
    io.to(idList[username]).emit('chat message',{
      username: from,
      message: msg
    })
 
    socket.broadcast.emit('user joined',{
      username: socket.username,
      userlist: userList
    }); //신규자가 왔을때 신규자 페이지를 위한 부분
 
    socket.emit('new people',{
      username: socket.username,
      userlist: userList
    }); //신규자가 왔을때 기존의 페이지들을 위한 부분
  });// 새로 user입장시 처리하는 부분
  // ++ 유저 입장시 오른쪽 부분에 목록에 추가되어야 합니다.
 
  socket.on('whisper',function(data){
    var msg =data.Msg;
    var to = data.To;
    var after_to = socket.username +'님에게';
    var from = socket.username;
    var after_from = socket.username +'님의 귓속말';
    for_reciever_socket_id = idList[to];
    for_sender_socket_id = idList[from];
    io.to(for_sender_socket_id).emit('chat message',{
      username: after_to,
      message: msg
    });
    io.to(for_reciever_socket_id).emit('chat message',{
      username: after_from,
      message: msg
    });
  });
 
  socket.on('change nickname',function(username){
    var lastname = socket.username;
    socket.username = username;
    index = userList.indexOf(lastname);
    userList[index] = socket.username;
    socket.emit('new nickname',{
      newname: socket.username,
      pastname: lastname,
      userlist: userList
    })
  })
});
 
http.listen(4000, function(){
  console.log('listening on *:4000');
});
