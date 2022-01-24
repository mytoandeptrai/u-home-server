require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./database/mongoDB");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

const port = process.env.PORT || 5000;

//Routers
app.use("/api", require("./router/authRouter"));
app.use("/api", require("./router/userRouter"));
app.use("/api", require("./router/issueRouter"));
app.use("/api", require("./router/eventRouter"));

connectDB();

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

app.listen(port, () => {
  console.log("Server is running on port", port);
});
