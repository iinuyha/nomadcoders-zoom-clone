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

io.on("connection", (socket) => {
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });
  // 클라이언트에서 소켓io의 emit을 통해 데이터를 전송하면 이벤트명, 데이터, 함수까지 커스텀 및 전달이 가능
  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName); // 해당 채팅룸에 참가
    done();
    socket.to(roomName).emit("welcome"); // 자신이 아닌 모든 브라우저에 대해서 welcome이벤트를 발생시키기
  });
  // 소켓의 연결이 해제되면 발생되는 것들
  socket.on("disconnecting", () => {
    // 각 채팅룸에 대해서 bye 이벤트를 발생시키기
    socket.rooms.forEach((room) => {
      socket.to(room).emit("bye");
    });
  }); // 자신이 아닌 모든 브라우저에 대해서 bye 이벤트를 발생시키기
  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", msg);
    done();
  });
});

// ➡️ 두 개의 프로토콜(http, websoket이 같은 포트를 사용함)

// const sockets = []; // 소켓에 연결된 서버들이 뭐뭐가 있는지 저장하는 배열

// // 웹소켓과 연결시, 소켓 실행
// wss.on("connection", (socket) => {
//   sockets.push(socket);

//   socket["nickname"] = "Anon";

//   // 소켓에서 프론트로 데이터를 전송
//   console.log("Connected to Browser ✅"); // 프론트와 연결될 시, 백엔드 터미널에 이게 뜸
//   socket.on("close", () => console.log("Disconnected from Browser ❌")); // 연결이 해제되면, 백엔드 터미널에 이게 뜸

//   // 프론트 측에서 보내는 (socket.send로 보내는) 메시지가 있다면, 백엔드 터미널에 이게 뜸
//   socket.on("message", (msg) => {
//     const message = JSON.parse(msg); // 메시지가 Object니까 파싱해줌
//     switch (message.type) {
//       // 타입이 메시지면 닉네임: 메시지를 띄워줌
//       case "new_message":
//         sockets.forEach((aSocket) =>
//           aSocket.send(`${socket.nickname}: ${message.payload}`)
//         );
//       // 타입이 닉네임이면 소켓의 닉네임 키에 닉네임을 넣어줌
//       case "nickname":
//         socket["nickname"] = message.payload;
//     }
//   });
// });

httpServer.listen(3000, handleListen);
