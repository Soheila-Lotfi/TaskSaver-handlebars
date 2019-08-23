var express = require("express");
var exphbs = require("express-handlebars");
var mysql = require("mysql");

// create an instance of express
var app = express();

// set  the port of the app

var PORT = process.env.PORT || 8080;

// set up express to handle data parsing--boiler plate

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// use handlebar as a view engine --middleware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// connect the server to the database

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Leila@1357",
  database: "task_saver_db"
});

connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }

  console.log("connected as id " + connection.threadId);
});

//routes

// show the tasks on the browser
app.get("/", function(req, res) {
  connection.query("SELECT * FROM tasks", function(err, data) {
    if (err) throw err;

    res.render("index", { tasks: data });
  });
});

// get the user input and post it to the server

app.post("/", function(req, res) {
  connection.query(
    "INSERT INTO tasks (task) VALUES (?)",
    [req.body.task],
    function(err, result) {
      if (err) throw err;
      console.log(result);
      res.redirect("/");
    }
  );
});

// start the sarver

app.listen(PORT, function() {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT);
});
