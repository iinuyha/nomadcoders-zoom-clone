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

// http 프로토콜을 사용하는 서버 생성
const httpServer = http.createServer(app); // "http://localhost:3000"에서 실행
// http서버 위에 웹소켓 프로토콜을 사용하는 서버 생성
const io = SocketIO(httpServer);

io.on("connection", (socket) => {
  socket.on("join_room", (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit("welcome");
  });
});

const handleListen = () => console.log(`Listening on http://localhost:3000`);

httpServer.listen(3000, handleListen);
