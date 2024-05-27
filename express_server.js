const express = require("express");
var cookieParser = require('cookie-parser')
const app = express();
const PORT = 8000;

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
    username: req.cookies["username"]
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
    username: req.cookies["username"]
   };
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const templateVars = { 
    id: req.params.id, 
    longURL: urlDatabase[req.params.id],
    username: req.cookies["username"]
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

app.post("/login", (req,res) => {
  // console.log(req.body.username);
  res.cookie("username", req.body.username)
  res.redirect("/urls");
})


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

