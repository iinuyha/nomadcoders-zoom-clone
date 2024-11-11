import http from "http";
import SocketIO from "socket.io";
import express from "express";

// http 프로토콜이 아닌, ws 프로토콜을 다루도록
const app = express();

// Node.js 에서 사용하는 템플릿 엔진 - ejs, pug, ..중 pug 사용
app.set("view engine", "pug"); // html 템플릿 뷰 엔진인 pug를 불러오기
app.set("views", __dirname + "/views"); // pug는 해당 경로 안에 있음
app.use("/public", express.static(__dirname + "/public")); // static 설정 (기본 경로 설정)

app.get("/", (req, res) => res.render("home")); // 루트경로에서 /views/home.pug를 렌더링
app.get("/*", (req, res) => res.redirect("/")); // 사용자가 어떤 경로로 가던 루트경로로 리다이렉션

const handleListen = () => console.log(`Listening on http://localhost:3000`);

// http 프로토콜을 사용하는 서버 생성
const httpServer = http.createServer(app); // "http://localhost:3000"에서 실행
// http서버 위에 웹소켓 프로토콜을 사용하는 서버 생성
const io = SocketIO(httpServer);

function publicRooms() {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = io;
  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
}

// 클라이언트가 서버에 연결되면 socket 객체를 통해 클라이언트와의 연결이 생성
io.on("connection", (socket) => {
  socket["nickname"] = "Anon"; // 소켓의 기본 nickname속성의 값을 Anon(익명)으로 설정

  // 클라이언트에서 발생하는 모든 이벤트를 가로채서 이벤트 이름을 콘솔에 출력
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });

  function countRoom(roomName) {
    return io.sockets.adapter.rooms.get(roomName)?.size;
  }

  // "enter_room"이벤트가 발생되면
  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName); // roomName이라는 이름의 방에 현재 소켓(클라이언트)을 참여시킴
    done();
    socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName)); // 특정 방(roomName)에 있는 클라이언트들(자신 제외)에게만 welcome 이벤트를 전송
    io.sockets.emit("room_change", publicRooms()); // "room_change" 이벤트를 모두에게 발생시킴
  });

  // 소켓의 연결이 해제되면
  socket.on("disconnecting", () => {
    // 각각의 채팅룸에 대해서 bye 이벤트를 발생시키기
    socket.rooms.forEach((room) => {
      socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1);
    });
  }); // 자신이 아닌 모든 브라우저에 대해서 bye 이벤트를 발생시키기

  socket.on("disconnect", () => {
    io.sockets.emit("room_change", publicRooms()); // "room_change" 이벤트를 모두에게 발생시킴
  });

  // "new_message"이벤트가 발생되면
  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
    done();
  });

  // 닉네임 저장 이벤트가 발생하면 socket의 닉네임 속성을 입력받은 nickname으로 설정하기
  socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
});

httpServer.listen(3000, handleListen);
