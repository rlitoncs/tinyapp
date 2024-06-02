//==============================================================================
// Dependencies
//==============================================================================
const express = require("express");
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const { generateRandomString, findUserByEmail, urlsForUser } = require('./helpers');
const { urlDatabase, users } = require('./CONSTANTS');


//==============================================================================
// Set-up
//==============================================================================
const app = express();
const PORT = 8000;


//==============================================================================
// Configuration
//==============================================================================
app.set("view engine", "ejs");


//==============================================================================
// Middleware
//==============================================================================
app.use(express.urlencoded({ extended: true })); // create and populate req.body
app.use(express.json());
app.use(cookieSession({
  name: 'tinyAppSession',
  keys:['key'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));


//==============================================================================
// Routes
//==============================================================================

//GET /
app.get("/", (req, res) => {
  return res.redirect("/login")
})

//GET /urls
app.get("/urls", (req, res) => {

  //get userID by accessing cookie
  const userID = req.session.user_id;

  //error handling: user is not logged in
  if (!userID){
    return res.status(401).send("401 Unauthorized. Please Login or Register")
  }

  const getUserURLS = urlsForUser(userID);
  const templateVars = { 
    urls: getUserURLS,
    user: users[userID],
   };

  res.render("urls_index", templateVars);

});

// POST /urls
app.post("/urls", (req, res) => { 

  const userID = req.session.user_id;

  //error handling: users cannot shorten URLs if not logged in
  if(!userID){
    return res.status(404).send("You must login to shorten URLs");
  }
  
  const short_url_id = generateRandomString();
  urlDatabase[short_url_id] = {
    longURL: req.body.longURL,
    userID: userID
  };

  res.redirect(`/urls/${short_url_id}`);

});


// GET /urls/new
app.get("/urls/new", (req, res) => {

  const userID = req.session.user_id;

  //error handling: redirect users who are not logged in
  if(!userID){
    return res.redirect("/login")
  }

  const templateVars = { 
    urls: urlDatabase,
    user: users[userID],
  };

  res.render("urls_new", templateVars);  

});

// GET /urls/:id
app.get("/urls/:id", (req, res) => {

  const userID = req.session.user_id;
  const getUserURLS = urlsForUser(userID);
  const short_url_id = req.params.id

  // error handling: users cannot access short urls if not logged in
  if (!userID){
    return res.status(404).send("404 Not Found. Please Login to access URLS")
  }

  // error handling: users can only access URLS they own/created
  if (!(getUserURLS[short_url_id])){
    return res.status(403).send("403 Forbidden. Requested URL does not exist. You are trying to access a URL you do not yet own");
  }

  const templateVars = { 
    id: short_url_id, 
    longURL: getUserURLS[short_url_id].longURL,
    user: users[userID],
   };

  res.render("urls_show", templateVars);

});


// POST /urls/:id
app.post("/urls/:id", (req,res) => {
  
  const userID = req.session.user_id;
  const getUserURLS = urlsForUser(userID);
  const short_url_id = req.params.id

  //error handling: users not logged in cannot edit short URLs 
  if (!userID){
    return res.status(401).send("401 Unauthorized to edit. Please Login")
  }
  
  //error handloing: logged in users cannot edit a short URL it does not own
  if (!(getUserURLS[short_url_id])){
    return res.status(404).send(`404 Not Found. ${short_url_id} does not exist `)
  }

  getUserURLS[short_url_id].longURL = req.body.longURL;

  res.redirect("/urls");
});


//GET /u/:id
app.get("/u/:id", (req, res) => {
  const short_url_id = req.params.id
  
   //error Handling: short URLs must exist in the database
   if (!urlDatabase[short_url_id]){
    return res.status(404).send("404 Not Found. Short URL does not exist")
  }

  const longURL = urlDatabase[short_url_id].longURL;

  res.redirect(longURL);

});

//POST /urls/:id/delete
app.post("/urls/:id/delete", (req, res) => {
  
  const userID = req.session.user_id;
  const getUserURLS = urlsForUser(userID);
  const short_url_id = req.params.id;

  //error handling: users not logged in cannot delete short URLs 
  if (!userID){
    return res.status(401).send("401 Unauthorized to delete. Please Login")
  }

  //error handling: users logged in cannot delete short URLS they do not own
  if (!(getUserURLS[short_url_id])){
    return res.status(404).send(`404 Not Found. ${short_url_id} does not exist `)
  }

  delete urlDatabase[short_url_id];
  res.redirect("/urls");
  
});

// GET /login
app.get('/login', (req,res) => {

  const userID = req.session.user_id;
  
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

// POST /login
app.post("/login", (req,res) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  const userID = findUserByEmail(userEmail, users); 

  //error handling: empty email or password
  if (!userEmail || !userPassword){
    return res.status(404).send('404 Not Found. Please provide a valid email address and password');
  }

  //error handling: email non-existent or password mismatch
  if (!users[userID]){
    return res.status(403).send('403 Forbidden. Email does not exist');
  } else if (!bcrypt.compareSync(userPassword, users[userID].password)){
    return res.status(403).send('403 Forbidden. Incorrect Password.');
  }

  req.session.user_id = userID;
  res.redirect("/urls");
})

// POST /logout
app.post("/logout", (req,res) => {
  req.session = null;
  res.redirect("/login");
})


// GET /register
app.get("/register", (req,res) => {

  const userID = req.session.user_id;

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

// POST /register
app.post("/register", (req, res) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  const hashedPassword = bcrypt.hashSync(userPassword, 10);
 
  //error handling: empty email or password
  if (!userEmail || !userPassword){
    return res.status(400).send('400 Bad Request. Please provide a valid email and password');
  }
  //error handling: email exists
  const user = findUserByEmail(userEmail, users);
  if (user){
    return res.status(400).send('400 Bad Request. Email has already been registered');
  }

  //create random userID
  const userID = generateRandomString();
  //add user
  users[userID] = {
    id: userID, 
    email: userEmail, 
    password: hashedPassword
  };
  
  req.session.user_id = userID;
  res.redirect("/urls");
})

//==============================================================================
// Listener
//==============================================================================
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

