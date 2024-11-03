// 여기가 프론트엔드임

const socket = new WebSocket(`ws://${window.location.host}`); // 프론트엔드에서 백엔드로 메세지를 보낼 수 있음
// 요기서 soket은 서버로의 연결을 뜻함
