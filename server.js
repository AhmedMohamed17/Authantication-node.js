require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const path = require("path");
const corsOptions = require("./config/corsOptions.js");
const router = require("./routes/root.js");
const authRoute = require("./routes/authRoutes.js");

const PORT = process.env.PORT || 5000;
//
//
connectDB();
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
//

app.use("/", express.static(path.join(__dirname, "public")));
app.use("/", router);
app.use("/auth", authRoute);
app.use("/users", require("./routes/UserRoutes.js"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 not Found" });
  } else {
    res.type("txt").send("404 not Found");
  }
});

//
//
//
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");

  app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
});

mongoose.connection.on("error", (err) => {
  console.log(err);
});
