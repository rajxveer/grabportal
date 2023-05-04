const express = require("express");
const router = require("./routes/routes");
const cors = require("cors");
const userDB = require("./config/userDB");
const cookieParser = require("cookie-parser");
const port = 1000;

app = express();

app.use(
  cors({
    credentials: true,
    // origin: ["https://grab-report.websandapps.my"],
    origin: ["http://localhost:3000","https://grab-report.websandapps.my"],
  })
);

app.use(cookieParser());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello");
});

app.use("/api", router);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

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
