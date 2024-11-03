import http from "http";
import WebSocket from "ws";
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
const server = http.createServer(app); // "http://localhost:3000"에서 실행
// http서버 위에 웹소켓 프로토콜을 사용하는 서버 생성
const wss = new WebSocket.Server({ server }); // "ws://localhost:3000"에서 실행
// ➡️ 두 개의 프로토콜(http, websoket이 같은 포트를 사용함)

// 웹소켓과 연결시, 소켓 실행
wss.on("connection", (soket) => {
  console.log(soket); // 요기서 soket은 연결된 브라우저를 뜻함
});

server.listen(3000, handleListen);
