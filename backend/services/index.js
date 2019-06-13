const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/User')


// Create a token from a payload 
function createToken(payload, secretKey, options) {
  return jwt.sign(payload, secretKey, options)
}

// Verify the token 
function verifyToken(token, secretKey) {
  try {
    return jwt.verify(token, secretKey)
  } catch (e) {
    return null
  }
}

// Check if the user exists in database
async function isAuthenticated({ email, password }) {
  let user = null
  try {
    user = await User.query().where('email', '=', email)
    if (user && bcrypt.compareSync(password, user[0].password)) return user[0]
  } catch (e) { }
  return null
}

module.exports = {
  createToken,
  verifyToken,
  isAuthenticated,
}