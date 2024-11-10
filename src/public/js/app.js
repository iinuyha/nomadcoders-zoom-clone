const socket = io(); // 알아서 socket.io를 실행하고 있는 서버 찾기

const welcome = document.getElementById("welcome");
const searchRoom = welcome.querySelector("#searchRoom");
const nameForm = welcome.querySelector("#name");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

searchRoom.addEventListener("submit", handleRoomSubmit);
nameForm.addEventListener("submit", handleNicknameSubmit);

// 방 검색
function handleRoomSubmit(event) {
  event.preventDefault();
  const input = searchRoom.querySelector("input");
  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;
  input.value = "";
}

// 닉네임 설정
function handleNicknameSubmit(event) {
  event.preventDefault();
  const input = welcome.querySelector("#name input");
  socket.emit("nickname", input.value);
}

function addMessage(msg) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = msg;
  ul.appendChild(li);
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
  const msgForm = room.querySelector("#msg");
  msgForm.addEventListener("submit", handleMessageSubmit);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#msg input");
  const value = input.value;
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = "";
}

// 웰컴 이벤트가 실행이 되면 addMessage 함수를 실행
socket.on("welcome", (user) => addMessage(`${user}님이 참여했습니다!`));

// 바이 이벤트가 실행이 되면 addMessage 함수를 실행
socket.on("bye", (user) => addMessage(`${user}님이 퇴장했습니다.`));

socket.on("new_message", (msg) => {
  addMessage(msg);
});
