const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use(cors());

const db = mysql.createConnection({
  host: "bbvpane7yrtzjfbr9msv-mysql.services.clever-cloud.com",
  user: "ujjap8ie8g4p0gnx",
  password: "NGV28rbBa8gjGrtYLe3I",
  database: "bbvpane7yrtzjfbr9msv",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected Database...");
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/login", (req, res) => {
  const { gmail, token } = req.body;

  const q = "SELECT COUNT(*) FROM `account` WHERE `gmail` = ?"

  db.query(q, [gmail], function (err, result) {
    if (err) throw err;

    if (result[0]["COUNT(*)"] > 0) {

      const q1 = "UPDATE `account` SET `token` =? WHERE `gmail` =?";

      db.query(q1, [token, gmail], function (err, result) {
        if (err) throw err;
        res.status(200).json({ gmail: gmail });
      });
      
    } else {
      const q2 = "INSERT INTO `account`(`gmail`, `token`, `status`) VALUES (?,?, 1)";

      db.query(q2, [gmail, token], function (err, result) {
        if (err) throw err;
        res.status(200).json({ gmail: gmail });
      });
    }
  })



});

app.get("/login/status", (req, res) => {
  const gmail = req.query.gmail

  const q = "SELECT `status` FROM `account` WHERE `gmail` = ?";

  db.query(q, [gmail], function (err, result) {
    if (err) throw err;
    res.status(200).json(result[0]);
  });
})

app.listen(8000, () => console.log("server is running in port 3000"));
