// 여기가 프론트엔드임

const messageList = document.querySelector("ul");
const form = document.querySelector("form");

const socket = new WebSocket(`ws://${window.location.host}`); // 프론트엔드에서 백엔드로 메세지를 보낼 수 있음
// 요기서 soket은 서버로의 연결을 뜻함

// 소켓이 열리면(연결되면) 실행될 함수
// 페이지가 열리면 소켓이 자동으로 연결될텐데, 그때 콘솔창에 실행됨
socket.addEventListener("open", () => {
  console.log("Connected to Server ✅");
});

// 소켓이 메시지를 받으면(서버로부터 socket.send를 통해 받은 메시지) 실행될 함수
socket.addEventListener("message", (message) => {
  console.log("New message : ", message.data);
});

// 소켓이 닫히면(연결이 해제되면)) 실행될 함수
socket.addEventListener("close", () => {
  console.log("Disconnected from Server ❌");
});

setTimeout(() => {
  socket.send("Hello from the browser!"); // 10초 후, socket.send로 백엔드로 메시지를 보냄
}, 10000);
