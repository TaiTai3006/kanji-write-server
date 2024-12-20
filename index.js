const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const nodemailer = require("nodemailer");
const cron = require("node-cron");

const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use(cors());

const db = mysql.createConnection({
  host: "bbmsmxl3saczx0opirod-mysql.services.clever-cloud.com",
  user: "uqt2kmsjk0qb0npa",
  password: "XzyNQrEYbWS9ZOHiMIRn",
  database: "bbmsmxl3saczx0opirod",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected Database...");
});

app.post("/add-user", (req, res) => {

  const ip = req.body.ip || req.query.ip; // Lấy dữ liệu 'ip' từ body request
    if (!ip) {
        return res.status(400).json({ error: 'IP is required' });
    }

  const q =
    "INSERT INTO `user`( `ip`) VALUES (?)";

  db.query(q, [ip], function (err, result) {
    if (err) throw err;
    res.status(200).json({ message: "User added successfully" });
  });
})

app.get("/", (req, res) => {
  res.send("Hello World");
});

// app.post("/login", (req, res) => {
//   const { gmail, token } = req.body;

//   console.log(req.body);

//   const q = "SELECT COUNT(*) FROM `account` WHERE `gmail` = ?";

//   db.query(q, [gmail], function (err, result) {
//     if (err) throw err;

//     if (result[0]["COUNT(*)"] > 0) {
//       const q1 = "UPDATE `account` SET `token` =? WHERE `gmail` =?";

//       db.query(q1, [token, gmail], function (err, result) {
//         if (err) throw err;
//         console.log(result);
//         res.status(200).json({ gmail: gmail });
//       });
//     } else {
//       const q2 =
//         "INSERT INTO `account`(`gmail`, `token`, `status`) VALUES (?,?, 1)";

//       db.query(q2, [gmail, token], function (err, result) {
//         if (err) throw err;
//         res.status(200).json({ gmail: gmail });
//       });
//     }
//   });
// });

// app.get("/login/status", (req, res) => {
//   const gmail = req.query.gmail;

//   const q = "SELECT `status` FROM `account` WHERE `gmail` = ?";

//   db.query(q, [gmail], function (err, result) {
//     if (err) throw err;
//     res.status(200).json(result[0].status);
//   });
// });

// app.get("/task", (req, res) => {
//   const q = "SELECT * FROM `task`";

//   db.query(q, function (err, result) {
//     if (err) throw err;
//     res.status(200).json(result);
//   });
// });

// app.post("/assgin-task", (req, res) => {
//   const { list } = req.body;

//   const queries = list.map((data) => {
//     return new Promise((resolve, reject) => {
//       const q =
//         "INSERT INTO `assign_task`( `taskname`, `deadline`, `user`) VALUES (?,?,?)";
//       db.query(q, [data.taskname, data.deadline, data.user], (err, result) => {
//         if (err) {
//           return reject(err);
//         }
//         resolve(result);
//       });
//     });
//   });

//   Promise.all(queries)
//     .then(() => {
//       res.status(200).json("success");
//     })
//     .catch((err) => {
//       res.status(500).json({ error: err.message });
//     });
// });

// function formatTasks(tasks) {
//   return tasks.map((task) => {
//     const date = new Date(task.deadline);
//     const formattedDate = `${date.getFullYear()}-${String(
//       date.getMonth() + 1
//     ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
//     return {
//       ...task,
//       deadline: formattedDate,
//     };
//   });
// }

// app.get("/assgin-task", (req, res) => {
//   const start = req.query.start;
//   const end = req.query.end;
//   const q =
//     "SELECT * FROM `assign_task` WHERE `deadline` >= ? AND `deadline` <= ? ORDER BY `deadline` ASC";

//   db.query(q, [start, end], function (err, result) {
//     if (err) throw err;
//     res.status(200).json(formatTasks(result));
//   });
// });

// app.post("/assgin-task/status", (req, res) => {
//   const { status, id } = req.body;

//   const q = "UPDATE `assign_task` SET `status`= ? WHERE `id` = ?";

//   db.query(q, [status, id], function (err, result) {
//     if (err) throw err;
//     res.status(200).json(result);
//   });
// });

// app.post("/assgin-task/delete", (req, res) => {
//   const { id } = req.body;

//   const q = "DELETE FROM `assign_task` WHERE `id` = ?";

//   db.query(q, [id], function (err, result) {
//     if (err) throw err;
//     res.status(200).json(result);
//   });
// });

// app.get("/user", (req, res) => {
//   const q = "SELECT `gmail` FROM `account`";

//   db.query(q, function (err, result) {
//     if (err) throw err;
//     res.status(200).json(result);
//   });
// });

// app.get("/assgin-task/today/:id", (req, res) => {
//   const { id } = req.params;
//   const q =
//     "SELECT * FROM `assign_task` WHERE `deadline` = CURDATE() and `user` = ? AND `status` = 'Pending'";

//   db.query(q, [id], function (err, result) {
//     if (err) throw err;
//     res.status(200).json(result);
//   });
// });

// app.put("/assgin-task/:id", (req, res) => {
//   const { id } = req.params;
//   const { img, note } = req.body;

//   const date = new Date();

//   const q =
//     "UPDATE `assign_task` SET `img`= ?,`note`= ?,`submitDate`= ?,`status`='In Progress' WHERE `id` = ?";

//   db.query(q, [img, note, date, id], function (err, result) {
//     if (err) throw err;
//     const query = "SELECT * FROM `assign_task` WHERE `id` = ?";
//     db.query(query, [id], function (err, result) {
//       if (err) throw err;

//       sendmail(
//         `[Hoàn thành] ${result[0].taskname} - ${result[0].submitDate}`,
//         "",
//         result[0].user
//       );

//       sendmail(
//         `[Submit] ${result[0].user} - ${result[0].taskname} - ${result[0].submitDate}`,
//         `<div >
//                     <img src=${result[0].img}>
//                     <p class="status-text">${result[0].note}</p>
//                 </div>`,
//         "taitran3006@gmail.com",
//         1
//       );
//     });

//     res.status(200).json(result);
//   });
// });

// const sendmail = async (subject, content, recipient, type = 0) => {
//   let transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     service: "Gmail",
//     auth: {
//       user: "taitran30062002@gmail.com",
//       pass: "penrnghmzedxeflu",
//     },
//   });

//   let mailOptions = {
//     from: "taitran30062002@gmail.com",
//     to: recipient,
//     subject: subject,
//     [type === 1 ? "html" : "text"]: content,
//   };

//   try {
//     let info = await transporter.sendMail(mailOptions);
//     console.log("Email sent: " + info.response);
//   } catch (error) {
//     console.error("Error sending email: ", error);
//   }
// };

// app.post("/sendTaskIMG", (req, res) => {
//   const { img } = req.body;

//   const q = "SELECT * FROM `account`";

//   db.query(q, function (err, result) {
//     if (err) throw err;
//     for (let i = 0; i < result.length; i++) {
//       sendmail(
//         `[Thông báo] Lịch việc nhà nè.`,
//         `<img src=${img} style={{ width: "100px" }}/>`,
//         result[i].gmail,
//         1
//       );
//     }
//     res.status(200).json(result);
//   });
// });

// cron.schedule("00 09 * * *", () => {
//   const q = "SELECT * FROM `account`";

//   db.query(q, (err, listAccounts) => {
//     if (err) throw err;

//     const q1 =
//       "SELECT * FROM `assign_task` WHERE `deadline` = CURDATE() and `user` = ? AND `status` = 'Pending'";

//     for (let i = 0; i < listAccounts.length; i++) {
//       db.query(q1, [listAccounts[i].gmail], (err, tasks) => {
//         if (err) throw err;

//         if (tasks.length == 0) return; // Nếu không có công việc pending thì bỏ qua

//         // Tạo danh sách công việc dưới dạng HTML
//         let taskList = "<ul>";
//         tasks.forEach((task) => {
//           taskList += `<li>${task.taskname}</li>`;
//         });
//         taskList += "</ul>";

//         // Tạo nội dung email
//         const content = `
//           <div>
//             <h3>Danh sách công việc cần làm hôm nay:</h3>
//             ${taskList}
//             <p>Nhấn vào link bên dưới để biết thêm về nội dung công việc.</p>
//             <a href="https://assign-work-client.vercel.app/task?user=${listAccounts[i].gmail}">
//               https://assign-work-client.vercel.app/task?user=${listAccounts[i].gmail}
//             </a>
//           </div>
//         `;

//         // Gửi email
//         sendmail(
//           "[Thông báo] Công việc phải làm ngày hôm nay.",
//           content,
//           listAccounts[i].gmail,
//           1
//         );
//       });
//     }
//   });
// });

// cron.schedule("00 23 * * *", () => {
//   const q = "SELECT * FROM `account`";

//   db.query(q, (err, listAccounts) => {
//     if (err) throw err;

//     const q1 =
//       "SELECT * FROM `assign_task` WHERE `deadline` = CURDATE() and `user` = ? AND `status` = 'Pending'";

//     for (let i = 0; i < listAccounts.length; i++) {
//       db.query(q1, [listAccounts[i].gmail], (err, tasks) => {
//         if (err) throw err;

//         if (tasks.length == 0) return; // Nếu không có công việc pending thì bỏ qua

//         // Tạo danh sách công việc dưới dạng HTML
//         let taskList = "<ul>";
//         tasks.forEach((task) => {
//           taskList += `<li>${task.taskname}</li>`;
//         });
//         taskList += "</ul>";

//         // Tạo nội dung email
//         const content = `
//           <div>
//             <h3>Danh sách công việc cần làm hôm nay:</h3>
//             ${taskList}
//             <p>Nhấn vào link bên dưới để biết thêm về nội dung công việc.</p>
//             <a href="https://assign-work-client.vercel.app/task?user=${listAccounts[i].gmail}">
//               https://assign-work-client.vercel.app/task?user=${listAccounts[i].gmail}
//             </a>
//           </div>
//         `;

//         // Gửi email
//         sendmail(
//           "[Nhắc nhỡ] Công việc hôm nay của bạn vẫn còn.",
//           content,
//           listAccounts[i].gmail,
//           1
//         );
//       });
//     }
//   });
// });

// cron.schedule('00 10 * * 0', () => {
//   // code thực hiện công việc
//   const content = `
//           <div>
//             <p>Xắp xếp công việc và kiểm tra đánh giá.</p>
//             <a href="https://assign-work-client.vercel.app/admin">
//               https://assign-work-client.vercel.app/admin
//             </a>
//           </div>
//         `;

//         sendmail(
//           "[Nhắc nhỡ] Soạn công việc cho tuần mới",
//           content,
//           "taitran3006@gmail.com",
//           1
//         );
// });




app.listen(8000, () => console.log("server is running in port 8000"));
