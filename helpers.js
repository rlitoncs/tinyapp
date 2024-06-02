/**
 * generateRandomString() function creates a random 6 alpha-numeric character ID for a short URL
 * 
 * findUserByEmail(email, database) function handles incoming user emails and identifies whether emails are found in the database. 
 * @param { String } email - the user email
 * @param { Object } database - the users database
 * @return { Object || null } - returns the userID object if found or otherwise null
 * 
 * urlsForUser(id) functions returns all current URLS for the given user ID
 * @param { String } id - the current user ID
 */

//==============================================================================
// Dependencies
//==============================================================================
const { urlDatabase } = require('./CONSTANTS');


//==============================================================================
// Helper Functions
//==============================================================================
const generateRandomString = () => {
  const random_short_url = Math.random().toString(36).slice(2, 8);
  return random_short_url;
};

const findUserByEmail = (email, database) => {
  for (let userID in database) {
    if (database[userID].email === email) {
      return userID;
    }
  }
  return null;
};

const urlsForUser = (id) => {
  const userURLS = {};

  for (let shortID in urlDatabase) {
    if (urlDatabase[shortID].userID === id) {
      userURLS[shortID] = urlDatabase[shortID];
    }
  }

  return userURLS;
};

//==============================================================================
// Module Exports
//==============================================================================
module.exports = { generateRandomString, findUserByEmail, urlsForUser };