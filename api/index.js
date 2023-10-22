const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const salt = 10;

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "Saharruddin213.",
  database: "verkkolaitteet",
};

let db = mysql.createConnection(dbConfig);

function handleDisconnect() {
  db = mysql.createConnection(dbConfig);

  db.connect((err) => {
    if (err) {
      console.log("Database Connection Failed !!!", err);
      setTimeout(handleDisconnect, 2000); // Attempt to reconnect every 2 seconds
    } else {
      console.log("Connected to Database");
      console.log("Creating database table");
      let tableName = "contact_db";

      // Query to create table
      let query = `CREATE TABLE ${tableName} 
        (id INT AUTO_INCREMENT PRIMARY KEY,
        ip VARCHAR(255) NOT NULL, nimi VARCHAR(255) NOT NULL, osoite VARCHAR(255) NOT NULL
        )`;

      db.query(query, (err, rows) => {
        if (err) {
          console.log("Table Exist");
        } else {
          console.log(`Successfully Created Table - ${tableName}`);
        }
      });
    }
  });

  db.on("error", function (err) {
    console.log("Database error:", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET", "DELETE", "PUT"],
    credentials: true,
  })
);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// app.get("/", (req, res) => {
//   res.json("Testing Node.js Server");
// });

app.get("/api/get", (req, res) => {
  const sqlGet = "SELECT * from contact_db";
  db.query(sqlGet, (err, result) => {
    res.send(result);
  });
});

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ Error: "You are not authenticated" });
  } else {
    jwt.verify(token, "1234", (err, decoded) => {
      if (err) {
        return res.json({ Error: "Token is not okey" });
      } else {
        req.username = decoded.username;
        next();
      }
    });
  }
};

app.get("/", verifyUser, (req, res) => {
  return res.json({ Status: "Success", username: req.username });
});

app.post("/register", (req, res) => {
  const sqlInsert = "INSERT INTO login(username,password) VALUES (?,?)";

  bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
    if (err) return res.json({ Error: "Error for hassing password" });

    const values = [req.body.username, hash];

    db.query(sqlInsert, values, (err, result) => {
      if (err) return res.json({ Error: "Inserting data Error in server" });
      return res.json({ Status: "Success" });
    });
  });
});

app.post("/login", (req, res) => {
  const sql = "SELECT * FROM login WHERE username =?";
  db.query(sql, req.body.username, (err, data) => {
    if (err) return res.json({ Error: "Login error" });
    if (data.length > 0) {
      bcrypt.compare(
        req.body.password.toString(),
        data[0].password,
        (err, response) => {
          if (err) res.json({ Error: "No username existed" });
          if (response) {
            const username = data[0].username;
            const token = jwt.sign({ username }, "1234", {
              expiresIn: "1d",
            });
            res.cookie("token", token);
            return res.json({ Status: "Success" });
          } else {
            return res.json({ Error: "Password didn't match" });
          }
        }
      );
    } else {
      return res.json({ Error: "No username existed" });
    }
  });
});

app.post("/api/post", (req, res) => {
  const { ip, nimi, osoite } = req.body;
  const sqlInsert = "INSERT INTO contact_db(ip, nimi, osoite) VALUES(?,?,?)";
  db.query(sqlInsert, [ip, nimi, osoite], (error, result) => {
    if (error) console.log(error);
  });
});

app.delete("/api/remove/:tableName/:id", (req, res) => {
  const { tableName, id } = req.params;
  const sqlRemove = `DELETE FROM ${tableName} WHERE id=?`;
  db.query(sqlRemove, id, (error, result) => {
    if (error) console.log("ei onnistu");
  });
});

app.get("/api/get/:id", (req, res) => {
  const { id } = req.params;
  const sqlGet = "SELECT * from contact_db WHERE id = ?";
  db.query(sqlGet, id, (err, result) => {
    if (err) console.log(err);
    res.send(result);
  });
});

app.put("/api/update/:id", (req, res) => {
  const { id } = req.params;
  const { ip, nimi, osoite } = req.body;
  const sqlUpdate =
    "UPDATE contact_db SET ip= ?, nimi= ?, osoite= ? WHERE id=?";
  db.query(sqlUpdate, [ip, nimi, osoite, id], (err, result) => {
    if (err) console.log(err);
    res.send(result);
  });
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
