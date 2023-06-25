const express = require("express");
const app = express();
const APP_port = require("./config");
const connectDB = require("./database/connection");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const {requireAuth, checkUser} = require('./middleware/authMiddleware')

// middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set("view engine", "ejs");

// mongoDB connection
connectDB();

app.listen(APP_port, () => {
  console.log(`Server is running on port ${APP_port}.`);
});

// routes
app.get('*', checkUser);
app.get("/", requireAuth,(req, res) => res.render("home"));
app.get("/smoothies", requireAuth,(req, res) => res.render("smoothies"));
app.use(authRoutes);

// cookies
app.get("/set-cookies", (req, res) => {
  // res.setHeader("Set-Cookie", "newUser=true");
  res.cookie("newUser", false);
  res.cookie("isEmployee", true, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true });
  res.send("You got the cookies");
});

app.get("/read-cookies", (req, res) => {
  const cookies = req.cookies;
  console.log(cookies.newUser);
  res.json(cookies);
});
