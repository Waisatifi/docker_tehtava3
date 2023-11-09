const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const salt = 10;

require("dotenv").config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

let db;



function handleDisconnect() {
  db = mysql.createConnection(dbConfig);
  db.connect((err) => {
    if (err) {
      console.log("Database Connection Failed !!!", err);
      setTimeout(handleDisconnect, 2000); // Attempt to reconnect every 2 seconds
    } else {
      console.log("Connected to Database");
      console.log("Creating database table");
      let tableNames = [
        "reititin_db",
        "kytkimet_db",
        "nas_db",
        "epdu_db",
        "proxmox_db",
      ];

      let userTable = "users";
      let userquery = `CREATE TABLE ${userTable}
          (id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL)`;

      db.query(userquery, (err, rows) => {
        if (err) {
          console.log(`Table ${userTable} Exist`);
        } else {
          console.log(`Successfully created Table - ${userTable}`);
        }
      });

      tableNames.forEach((tableName) => {
        // Query to create table
        let query = `CREATE TABLE ${tableName} 
          (id INT AUTO_INCREMENT PRIMARY KEY,
          ip VARCHAR(255) NOT NULL, nimi VARCHAR(255) NOT NULL UNIQUE, osoite VARCHAR(255) NOT NULL
          )`;

        db.query(query, (err, rows) => {
          if (err) {
            console.log(`Table ${tableName}  Exist`);
          } else {
            console.log(`Successfully Created Table - ${tableName}`);
            seedDatabase(tableName);
          }
        });
      });
    }



  });

  function seedDatabase(databaseName) {
    // insert known data to the tables at start up
    const tablesWithSeedData = {
      reititin_db: [
        { ip: "10.0.0.1", nimi: "fs.com SF-5105", osoite: "http://10.0.0.2" }
      ],
      kytkimet_db: [
        { ip: "10.0.0.2", nimi: "Aruba-2930F-48G-PoEP-4SFPP", osoite: "http://10.0.0.2" },
        { ip: "10.0.0.3", nimi: "ubiguiti EdgeSwitch", osoite: "https://10.0.0.3" },
        { ip: "10.0.0.4", nimi: "D-Link DXS-1210-10", osoite: "http://10.0.0.4" },
        { ip: "10.0.0.5", nimi: "D-Link DGS-1510-28X", osoite: "http://10.0.0.5" },
        { ip: "10.0.0.6", nimi: "HP Officeconnect 1820 j9982A", osoite: "http://10.0.0.6" },
        { ip: "10.0.0.7", nimi: "HP 2530-24G Switch j9776A", osoite: "http://10.0.0.7" },
        { ip: "10.0.0.8", nimi: "fs.com S5960-20SQ", osoite: "https://10.0.0.8" },
        { ip: "10.0.0.10", nimi: "fs.com S3910-24TS", osoite: "https://10.0.0.10" },
        { ip: "10.0.0.14", nimi: "fs.com S3910-24TS", osoite: "https://10.0.0.14" }
      ],
      nas_db: [
        { ip: "10.0.0.100", nimi: "QNAP", osoite: "https://10.0.0.100" }
      ],
      epdu_db: [
        { ip: "10.0.0.129", nimi: "ePDU", osoite: "http://labrapdu.labra.local" }
      ],
      proxmox_db: [
        { ip: "10.0.1.10", nimi: "proxmox", osoite: "http://10.0.1.10" },
        { ip: "10.0.1.11", nimi: "pve2", osoite: "http://10.0.1.11" },
        { ip: "10.0.1.12", nimi: "pve3", osoite: "http://10.0.1.12" },
        { ip: "10.0.1.13", nimi: "pve4", osoite: "http://10.0.1.13" },
        { ip: "10.0.1.14", nimi: "pve5", osoite: "http://10.0.1.14" },
        { ip: "10.0.1.15", nimi: "pve6", osoite: "http://10.0.1.15" },
        { ip: "10.0.1.16", nimi: "pve7", osoite: "http://10.0.1.16" },
        { ip: "10.0.1.17", nimi: "pve8", osoite: "http://10.0.1.17" },
        { ip: "10.0.1.18", nimi: "pvedellR710", osoite: "http://10.0.1.18" },
        { ip: "10.0.1.22", nimi: "pvedellR720", osoite: "http://10.0.1.22" },
        { ip: "10.0.1.24", nimi: "dell3", osoite: "http://10.0.1.24" }
      ]
    }

    if (tablesWithSeedData.hasOwnProperty(databaseName)) {
      let rows = tablesWithSeedData[databaseName];
      rows.forEach(row => {
        const columns = Object.keys(row).join(", ");
        const placeholders = new Array(Object.keys(row).length).fill("?").join(", ");
        const values = Object.values(row);
  
        const sqlInsert = `INSERT IGNORE INTO ${databaseName} (${columns}) VALUES (${placeholders})`;
        // Assuming db.query is already defined and handles the query execution
        db.query(sqlInsert, values, (error, result) => {
          if (error) {
            console.error(`Error seeding ${databaseName}:`, error);
          } else {
            console.log(`Seeded ${databaseName} with known data successfully.`);
          }
        });
      });
    } else {
      console.error(`No seed data found for ${databaseName}`);
    }
  }


  db.on("error", function (err) {
    console.log("Database error:", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      handleDisconnect();
    } else {
      console.error("ei yhdistynt tietokantaan, älä huoli kohta yhdistyy:", err);
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

app.get("/api/get/:tableName", (req, res) => {
  const { tableName } = req.params;
  const sqlGet = `SELECT * from ${tableName}`;
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
  const sqlInsert = "INSERT INTO users(username,password) VALUES (?,?)";

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
  const sql = "SELECT * FROM users WHERE username =?";
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
            const token = jwt.sign({ username }, process.env.TOKEN_SECRET_KEY, {
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

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: "Success" });
});

app.post("/api/post/:tableName", (req, res) => {
  const { tableName } = req.params;
  const { ip, nimi, osoite } = req.body;
  const sqlInsert = `INSERT INTO ${tableName} (ip, nimi, osoite) VALUES(?,?,?)`;
  db.query(sqlInsert, [ip, nimi, osoite], (error, result) => {
    if (error) console.log(error);
  });
});

app.put("/api/update/:tableName/:id", (req, res) => {
  const { tableName, id } = req.params;
  const { ip, nimi, osoite } = req.body;
  const sqlUpdate = `UPDATE ${tableName} SET ip= ?, nimi= ?, osoite= ? WHERE id=${id}`;
  db.query(sqlUpdate, [ip, nimi, osoite], (err, result) => {
    if (err) console.log(err);
    res.send(result);
  });
});

app.delete("/api/remove/:tableName/:id", (req, res) => {
  const { tableName, id } = req.params;
  const sqlRemove = `DELETE FROM ${tableName} WHERE id=?`;
  db.query(sqlRemove, id, (error, result) => {
    if (error) {
      console.error("Error deleting record:", error);
      res
        .status(500)
        .json({ error: "An error occurred while deleting the record." });
    } else {
      res.json({ message: "Record deleted successfully." });
    }
  });
});

app.get("/api/get/:tableName/:id", (req, res) => {
  const { tableName, id } = req.params;
  const sqlGet = `SELECT * FROM ${tableName} WHERE id=?`;
  db.query(sqlGet, id, (err, result) => {
    if (err) {
      console.error(`Error SELECTING ${tableName} ${id} record:`, err);
      res
        .status(500)
        .json({ err: "An error occurred while SELECTING the record." });
    } else {
      res.send(result);
    }
  });
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
