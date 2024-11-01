import express from "express";

const app = express();

// Node.js 에서 사용하는 템플릿 엔진 - ejs, pug, ..중 pug 사용
app.set("view engine", "pug"); // html 템플릿 뷰 엔진인 pug를 불러오기
app.set("views", __dirname + "/views"); // pug는 해당 경로 안에 있음
app.use("/public", express.static(__dirname + "/public")); // static 설정 (기본 경로 설정)

app.get("/", (req, res) => res.render("home")); // 루트경로에서 /views/home.pug를 렌더링
app.get("/*", (req, res) => res.redirect("/")); // 사용자가 어떤 경로로 가던 루트경로로 리다이렉션

const handleListen = () => console.log(`Listening on http://localhost:3000`);

app.listen(3000, handleListen);
