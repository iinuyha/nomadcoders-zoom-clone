// 여기가 프론트엔드임

const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nick");
const messageForm = document.querySelector("#message");

const socket = new WebSocket(`ws://${window.location.host}`); // 프론트엔드에서 백엔드로 메세지를 보낼 수 있음
// 요기서 soket은 서버로의 연결을 뜻함

function makeMessage(type, payload) {
  const msg = { type, payload };
  return JSON.stringify(msg);
}

// 소켓이 열리면(연결되면) 실행될 함수
// 페이지가 열리면 소켓이 자동으로 연결될텐데, 그때 콘솔창에 실행됨
socket.addEventListener("open", () => {
  console.log("Connected to Server ✅");
});

// 소켓이 메시지를 받으면(서버로부터 socket.send를 통해 받은 메시지) 실행될 함수
socket.addEventListener("message", (message) => {
  const li = document.createElement("li");
  li.innerText = message.data;
  messageList.append(li);
});

// 소켓이 닫히면(연결이 해제되면)) 실행될 함수
socket.addEventListener("close", () => {
  console.log("Disconnected from Server ❌");
});

// 메시지 제출 버튼을 눌렀을 때 실행될 함수
function handleSubmit(event) {
  event.preventDefault(); // 폼의 기본 제출 동작(새로고침)을 막음

  // 원하는 커스텀 동작
  const input = messageForm.querySelector("input");
  socket.send(makeMessage("new_message", input.value)); // 백엔드로 input 내부의 값(입력한 메시지)를 전송하기..

  const li = document.createElement("li");
  li.innerText = `You: ${input.value}`;
  messageList.append(li);

  input.value = ""; // 전송한 이후에 input 내부의 값을 ""으로 다시 초기화
}

// 닉네임 입력버튼을 눌렀을 때 실행될 함수
function handleNickSubmit(event) {
  event.preventDefault(); // 폼의 기본 제출 동작(새로고침)을 막음

  // 원하는 커스텀 동작
  const input = nickForm.querySelector("input");
  socket.send(makeMessage("nickname", input.value)); // 백엔드로 input 내부의 값(입력한 메시지)를 전송하기..
}

messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);
