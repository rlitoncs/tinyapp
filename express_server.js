const express = require("express");
var cookieParser = require('cookie-parser')
const app = express();
const PORT = 8000;

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

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

const findUserByEmail = (email) => {
  for (let userID in users) {
    // return userID if found
    if (users[userID].email === email){
      return userID;
    }
  }
  //return null if no user is found
  return null;
}

const generateRandomString = () => {
  const random_short_url = Math.random().toString(36).slice(2, 8);
  return random_short_url;
}

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true })); // create and populate req.body
app.use(cookieParser()) // creates and populates req.cookies

app.get("/urls", (req, res) => {

  //get userID by accessing cookie
  const userID = req.cookies["user_id"];

  const templateVars = { 
    urls: urlDatabase,
    user: users[userID],
   };

  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  const short_url_id = generateRandomString();
  urlDatabase[short_url_id] = req.body.longURL; //save to the url database
  res.redirect(`/urls/${short_url_id}`);
});

app.get("/urls/new", (req, res) => {

   //get userID by accessing cookie
  const userID = req.cookies["user_id"];

  const templateVars = { 
    urls: urlDatabase,
    user: users[userID],
   };
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {

  //get userID by accessing cookie
  const userID = req.cookies["user_id"];

  const templateVars = { 
    id: req.params.id, 
    longURL: urlDatabase[req.params.id],
    user: users[userID],
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
// LOGIN/LOGOUT **
app.get('/login', (req,res) => {
  //get userID by accessing cookie
  const userID = req.cookies["user_id"];

  const templateVars = { 
    urls: urlDatabase,
    user: users[userID],
    };
  res.render("login", templateVars);
})


app.post("/login", (req,res) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  const userID = findUserByEmail(userEmail); //finds userID based on userEmail

  //Error Handling

  //a) Empty email or password
  if (!userEmail || !userPassword){
    return res.status(404).send('404 Not Found. Please provide a valid email address and password');
  }

  //b)
  if (!users[userID]){
    return res.status(403).send('403 Forbidden. Email does not exist');
  } else if (users[userID].password !== userPassword){
    return res.status(403).send('403 Forbidden. Incorrect Password.');
  }

  //Happy Path (user is in database)
  res.cookie("user_id", userID);
  res.redirect("/urls");
})

app.post("/logout", (req,res) => {
  res.clearCookie("user_id");
  res.redirect("/login");
})

//=========================================================================
//REGISTER
app.get("/register", (req,res) => {

  //get userID by accessing cookie
  const userID = req.cookies["user_id"];

  const templateVars = { 
    urls: urlDatabase,
    user: users[userID],
    };
  res.render("register", templateVars);
})

app.post("/register", (req, res) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  
  //error handling
  //a) empty email or password
  if (!userEmail || !userPassword){
    return res.status(400).send('400 Bad Request. Please provide a valid email and password');
  }
  //b) email already exists
  const user = findUserByEmail(userEmail);
  if (user){
    return res.status(400).send('400 Bad Request. Email has already been registered');
  }
  //==============================================================================
  //Register New Users (Happy Path)
  
  //create random userID
  const userID = generateRandomString();
  //add user
  users[userID] = {
    id: userID, 
    email: userEmail, 
    password: userPassword
  };

  //set userID cookie
  res.cookie("user_id", userID);

  // console.log(users);
  res.redirect("/urls");
})

//=========================================================================


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

