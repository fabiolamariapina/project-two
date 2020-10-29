//___________________
//Dependencies
//___________________
const express = require("express");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const app = express();
const db = mongoose.connection;

//___________________
//Port
//___________________
// Allow use of Heroku's port or
//your own local port, depending on the environment
const PORT = process.env.PORT || 3000;

//___________________
//Data
//___________________
const Makeup = require("./models/makeup.js");

//___________________
//Database
//___________________
// How to connect to the
//database either via heroku or locally
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/" + `FABI`;
// Connect to Mongo
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
// Error / success
db.on("error", (err) => console.log(err.message + " is Mongod not running?"));
db.on("connected", () => console.log("mongo connected: ", MONGODB_URI));
db.on("disconnected", () => console.log("mongo disconnected"));
// open the connection to mongo
db.on("open", () => {});

//___________________
//Middleware
//___________________
//use public folder for static assets
app.use(express.static("public"));
// populates req.body with parsed info from forms -
//if no data from forms will return an empty object {}
app.use(express.urlencoded({ extended: false })); // extended: false - does not allow nested objects in query strings
app.use(express.json()); // returns middleware that only parses JSON - may or may not need it depending on your project
//use method override
app.use(methodOverride("_method")); // allow POST, PUT and DELETE from a form

//___________________
// Routes
//___________________
//localhost:3000
// Welcome / Home Page
app.get("/", (req, res) => {
  res.render("home.ejs");
});

// Index
app.get("/yourCollection", (req, res) => {
  Makeup.find({}, (error, allMakeup) => {
    console.log(allMakeup);
    res.render("index.ejs", {
      makeup: allMakeup,
    });
  });
});

// Show
app.get("/yourCollection/:id", (req, res) => {
  Makeup.findById(req.params.id, (err, foundMakeup) => {
    res.send(foundMakeup);
  });
});

// New
app.get("/yourCollection/new", (req, res) => {
  res.render("new.ejs");
});

// Create
app.post("/yourCollection", (req, res) => {
  if (req.body.buyMore === "on") {
    req.body.buyMore = true;
  } else {
    req.body.buyMore = false;
  }
  Makeup.create(req.body, (error, createdMakeup) => {
    res.redirect("/yourCollection");
  });
});

//___________________
//Listener
//___________________
app.listen(PORT, () => console.log("Listening on port:", PORT));
