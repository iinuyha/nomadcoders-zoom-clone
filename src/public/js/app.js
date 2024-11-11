const socket = io(); // 알아서 socket.io를 실행하고 있는 서버 찾기

const welcome = document.getElementById("welcome");
const searchRoom = welcome.querySelector("#searchRoom");
const nameForm = welcome.querySelector("#name");
const room = document.getElementById("room");

room.hidden = true; // 초기엔 room div가 가려지기

let roomName; // 채팅룸 이름을 담을 수 있는 변수 선언

searchRoom.addEventListener("submit", handleRoomSubmit);
nameForm.addEventListener("submit", handleNicknameSubmit);

// 방 검색 버튼 클릭 시 실행
function handleRoomSubmit(event) {
  event.preventDefault(); // 기본 동작을 제거하고, 아래에서 설정한 커스텀 동작들을 실행하겠단 의미
  const input = searchRoom.querySelector("input");
  socket.emit("enter_room", input.value, showRoom); // 소켓에 "enter_room" 이벤트를 발생시키고, input의 값, showRoom함수를 전달
  roomName = input.value;
  input.value = "";
}

// 닉네임 저장 버튼 클릭 시 실행
function handleNicknameSubmit(event) {
  event.preventDefault(); // 기본 동작을 제거하고, 아래에서 설정한 커스텀 동작들을 실행하겠단 의미
  const input = welcome.querySelector("#name input");
  socket.emit("nickname", input.value); // 소켓에 "nickname" 이벤트를 발생시키고, input의 값을 전달
}

// room박스가 보여지는 함수
function showRoom() {
  welcome.hidden = true; // welcome div가 가려지기
  room.hidden = false; // room div가 보여지기
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
  const msgForm = room.querySelector("#msg");
  msgForm.addEventListener("submit", handleMessageSubmit);
}

// ul부분에 새로운 li를 추가하여 메시지를 보여주는 함수
function addMessage(msg) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = msg;
  ul.appendChild(li);
}

// 메시지 전송 버튼 클릭 시 실행
function handleMessageSubmit(event) {
  event.preventDefault(); // 기본 동작을 제거하고, 아래에서 설정한 커스텀 동작들을 실행하겠단 의미
  const input = room.querySelector("#msg input");
  const value = input.value;

  // 소켓에 "new_message" 이벤트를 발생시키고, input의 값, 방 이름, 이후 실행될 함수 전달
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = "";
}

// welcome 이벤트가 실행이 되면 addMessage 함수를 실행
socket.on("welcome", (user, newCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName} (${newCount})`;
  addMessage(`${user}님이 참여했습니다!`);
});

// bye 이벤트가 실행이 되면 addMessage 함수를 실행
socket.on("bye", (user, newCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName} (${newCount})`;
  addMessage(`${user}님이 퇴장했습니다.`);
});

// new_message 이벤트가 실행이 되면 addMessage 함수 실행
socket.on("new_message", (msg) => {
  addMessage(msg);
});

// room_change 이벤트가 실행이 되면 채팅룸 목록에 추가
socket.on("room_change", (rooms) => {
  const roomList = welcome.querySelector("ul");
  roomList.innerHTML = "";
  if (rooms.length === 0) {
    return;
  }
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.append(li);
  });
});
