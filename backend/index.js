const express = require("express");
const router = require("./routes/routes");
const cors = require("cors");
const userDB = require("./config/userDB");
const cookieParser = require("cookie-parser");

app = express();

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000"],
  })
);

app.use(cookieParser());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello");
});

app.use("/api", router);

app.listen(1000);

userDB.sync();

const jsonData = [
  {
    name: "Test 1",
    age: 13,
    average: 8.2,
    approved: true,
    description: "using 'Content here, content here' ",
  },
  {
    name: "Test 2",
    age: 11,
    average: 8.2,
    approved: true,
    description: "using 'Content here, content here' ",
  },
  {
    name: "Test 4",
    age: 10,
    average: 8.2,
    approved: true,
    description: "using 'Content here, content here' ",
  },
];
