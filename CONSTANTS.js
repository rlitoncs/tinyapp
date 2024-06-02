//==============================================================================
// Dependencies
//==============================================================================
const bcrypt = require('bcryptjs');

//==============================================================================
// Database(s)
//==============================================================================
const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
  aD80Ce: {
    longURL: "https://www.youtube.com/",
    userID: "userRandomID"
  },
  eP87Ce: {
    longURL: "https://www.w3schools.com/",
    userID: "user2RandomID"
  }
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur", 10)
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk", 10)
  },
  aJ48lW: {
    id: "aJ48lW",
    email: "a@example.com",
    password: bcrypt.hashSync("123", 10)
  },
};

//==============================================================================
// Module Exports
//==============================================================================
module.exports = { urlDatabase, users };