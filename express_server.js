const express = require("express");
var cookieParser = require('cookie-parser')
const app = express();
const PORT = 8000;

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

function generateRandomString() {
  const random_short_url = Math.random().toString(20).slice(2, 8);
  return random_short_url;
}

app.set("view engine", "ejs");

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.get("/urls", (req, res) => {
  const templateVars = { 
    urls: urlDatabase,
    allUsers: users,
    userID: req.cookies["user_id"]
   };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  const short_url_id = generateRandomString();
  urlDatabase[short_url_id] = req.body.longURL; //save to the url database
  res.redirect(`/urls/${short_url_id}`);
});

app.get("/urls/new", (req, res) => {
  const templateVars = { 
    allUsers: users,
    userID: req.cookies["user_id"]
   };
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const templateVars = { 
    id: req.params.id, 
    longURL: urlDatabase[req.params.id],
    userID: req.cookies["user_id"]
  };
  res.render("urls_show", templateVars);
});

app.post("/urls/:id", (req,res) => {
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect("/urls");
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

app.post("/urls/:id/delete", (req, res) => {
  const short_url_id = req.params.id;
  delete urlDatabase[short_url_id];
  res.redirect("/urls");
});

//=========================================================================
// LOGIN/LOGOUT

app.post("/login", (req,res) => {
  res.cookie("username", req.body.username)
  res.redirect("/urls");
})

app.post("/logout", (req,res) => {
  res.clearCookie("username");
  res.redirect("/urls");
})

//=========================================================================
//REGISTER
app.get("/register", (req,res) => {
  res.render("register")
})

app.post("/register", (req, res) => {
  //create random userID
  const userID = generateRandomString();
  //add user
  users[userID] = {id: userID, email: req.body.email, password: req.body.password};

  //set userID cookie
  res.cookie("user_id", userID);

  res.redirect("/urls");
})

//=========================================================================


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

