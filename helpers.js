const { urlDatabase } = require('./CONSTANTS');

const generateRandomString = () => {
  const random_short_url = Math.random().toString(36).slice(2, 8);
  return random_short_url;
};

const findUserByEmail = (email, database) => {
  for (let userID in database) {
    // return userID if found
    if (database[userID].email === email) {
      return userID;
    }
  }
  //return null if no user is found
  return null;
};

const urlsForUser = (id) => {
  const userURLS = {};

  for (let shortID in urlDatabase) {
    if (urlDatabase[shortID].userID === id) {
      userURLS[shortID] = urlDatabase[shortID];
    }
  }

  console.log(userURLS);
  return userURLS;
};

module.exports = { generateRandomString, findUserByEmail, urlsForUser };