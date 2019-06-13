const express = require('express')
const authRoutes = express.Router()

const { authUser } = require('../middleware/auth')
const { createToken, isAuthenticated } = require('../services')

const User = require('../models/User')
const keyv = require('../services/keyv')

const { KEY_EXPIRY, SECRET_KEY } = require('../config')

authRoutes
.post('/signup', async (req,res) => {
  // const {email, password} = req.body
  // password = bcrypt.hashSync(password, SALT_ROUNDS)
  // const rv = await createUser(email, password)
  res.status(201).end()
})
.get('/logout', authUser, async (req,res) => {
  // console.log('logging out')
  try {
    const incomingToken = req.headers.authorization.split(' ')[1]
    await keyv.delete(incomingToken)
    // clear the token
    return res.status(200).json({ message: 'Logged Out' })  
  } catch (e) { }
  return res.status(500).json()  
})
.post('/login', async (req,res) => {
  try {
      const { email, password } = req.body
      const user = await isAuthenticated({ email, password })
      if (!user) {
        const message = 'Incorrect email or password'
        return res.status(401).json({ message })
      }
      const { id } = user
      const token = createToken({ id }, SECRET_KEY,  {expiresIn: KEY_EXPIRY}) // 5 minute expire for login
      await keyv.set(token, token)
      return res.status(200).json({ token })  
    } catch (e) { }
    return res.status(500).json()  
  })
.get('/me', authUser, async (req,res) => {
  try {
      const { id } = req.decoded
      // you can also get more user information from here from a datastore
      return res.status(200).json({ user: id })
    } catch (e) { }
    return res.status(401).json({ message: 'Error token revoked' })
  })

module.exports = authRoutes
