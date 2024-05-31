const findUserByEmail = (email, database) => {
  for (let userID in database) {
    // return userID if found
    if (database[userID].email === email){
      return userID;
    }
  }
  //return null if no user is found
  return null;
}

module.exports = findUserByEmail;