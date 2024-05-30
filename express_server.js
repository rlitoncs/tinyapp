const express = require("express");
var cookieParser = require('cookie-parser')
const app = express();
const PORT = 8000;

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
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
  aJ48lW: {
    id: "aJ48lW",
    email: "a@example.com",
    password: "123",
  },
};

const urlsForUser = (id) => {
  const userURLS = {};

  for (let shortID in urlDatabase){
    if (urlDatabase[shortID].userID === id){
      userURLS[shortID] = urlDatabase[shortID];
    }
  }

  console.log(userURLS);
  return userURLS;
}

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

  const getUserURLS = urlsForUser(userID);

  const templateVars = { 
    urls: getUserURLS,
    user: users[userID],
   };

  if (userID){
    res.render("urls_index", templateVars);
    
  }else {
    return res.status(401).send("401 Unauthorized. Please Login or Register")
  }
});

app.post("/urls", (req, res) => { 
  //get userID by accessing cookie
  const userID = req.cookies["user_id"];

  //Users not logged in cannot shorten URLs (using curl command)
  if(!userID){
    return res.status(404).send("You must login to shorten URLs");
  }
  
  const short_url_id = generateRandomString();
  urlDatabase[short_url_id] = {
    longURL: req.body.longURL, //save to the url database
    userID: userID
  };
  res.redirect(`/urls/${short_url_id}`);
});

app.get("/urls/new", (req, res) => {

   //get userID by accessing cookie
  const userID = req.cookies["user_id"];

  const templateVars = { 
    urls: urlDatabase,
    user: users[userID],
  };

  //User has to be logged in create new short URLs
  if (userID){
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login")
  }

});

app.get("/urls/:id", (req, res) => {

  //get userID by accessing cookie
  const userID = req.cookies["user_id"];

  const templateVars = { 
    id: req.params.id, 
    longURL: urlDatabase[req.params.id].longURL,
    user: users[userID],
   };
  res.render("urls_show", templateVars);
});

app.post("/urls/:id", (req,res) => {
  urlDatabase[req.params.id].longURL = req.body.longURL;
  res.redirect("/urls");
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id].longURL;

  //Ensure short url exists in database
  if (longURL){
    res.redirect(longURL);
  } else {
    return res.status(404).send("404 Not Found. Short URL does not exist")
  }

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
  
  if (userID) {
    res.redirect("/urls")
  } else {
    res.render("login", templateVars);
  }
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

  if (userID) {
    res.redirect("/urls")
  } else {
    res.render("register", templateVars);
  }

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

