const express = require("express");
const mysql = require("mysql");
const dotenv = require("dotenv");

const app = express();

app.use(express.json());
app.use(express.static("public"));
//Automatically it takes views as the folder
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
dotenv.config({ path: "./config.env" });

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
  socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock",
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connection has been established");
});

// app.get("/createDb", (req, res) => {
//   let sql = "CREATE DATABASE nodeSQL";
//   db.query(sql, (err, result) => {
//     if (err) throw err;
//     res.send("Database created!");
//   });
// });

// app.get("/createTable", (req, res) => {
//   let sql =
//     "CREATE TABLE todo(id int auto_increment, task varchar(255), date date, primary key(id))";
//   db.query(sql, (err, result) => {
//     if (err) throw err;
//     res.send("We have create a new table bro");
//   });
// });

// app.get("/insertData", (req, res) => {
//   let data = { title: "World Cup Final", post: "France vs Crotia" };
//   let sql = "INSERT INTO post set ?";
//   db.query(sql, data, (err, result) => {
//     if (err) throw err;
//     res.send("New data has been entered");
//   });
// });

// app.get("/delete/:id", (req, res) => {
//   let sql = "DELETE FROM post WHERE id = " + req.params.id;
//   db.query(sql, (err, result) => {
//     if (err) throw err;
//     res.send("Data has been deleted");
//   });
// });

// app.get("/getData", (req, res) => {
//   let sql = "SELECT * FROM post";
//   db.query(sql, (err, result) => {
//     if (err) throw err;
//     res.send(result);
//   });
// });

//render home page
app.get("/", (req, res) => {
  let sql = "SELECT * FROM todo";
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.render("todo", { result });
  });
});

//POST
app.post("/", (req, res) => {
  let data = req.body;
  let sql = "INSERT INTO todo SET ?";
  db.query(sql, data, (err, result) => {
    if (err) throw err;
    res.redirect("/");
  });
});

app.get("/edit/:id", (req, res) => {
  let sql = "SELECT * FROM todo";
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.render("todoEdit", { todoTasks: result, idTask: req.params.id });
  });
});

app.post("/edit/:id", (req, res) => {
  let query = req.body.task;
  let sql = `UPDATE todo SET task = ? WHERE id = ${req.params.id}`;

  db.query(sql, query, (err, result) => {
    if (err) throw err;
    res.redirect("/");
  });
});

app.get("/remove/:id", (req, res) => {
  let sql = "DELETE FROM todo WHERE id = ?";
  db.query(sql, req.params.id, (err, result) => {
    if (err) throw err;
    res.redirect("/");
  });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
