const { createToken, verifyToken } = require('../services')
const keyv = require('../services/keyv')
const { KEY_EXPIRY, SECRET_KEY } = require('../config')

module.exports = {
  authUser: async (req, res, next) => {
    // console.log('auth express', req.path)
    try {
      if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
        return res.status(401).json({ message: 'Error in authorization format' })
      }
      const incomingToken = req.headers.authorization.split(' ')[1]
      const matchingToken = await keyv.get(incomingToken)
      if (matchingToken) {
        const key = SECRET_KEY // select the key to use
        const result = verifyToken(matchingToken, key)
        if (result) { // id, iat, remove exp
          if (result.exp) delete result.exp
          req.decoded = result
          // console.log(result)
          // try to throttle createToken by check exp
          // const now = Date.now() / 1000
          // if (decoded.exp - now < 120) { // 2 minutes to expiry - this may cause problems...
          // please be careful here, if first time, token may not be set and you get error logging in
          // console.log('update token')
          await keyv.set(incomingToken, createToken(result, key, {expiresIn: KEY_EXPIRY})) // do refresh token here...
          // }
          return next()
        }
      }
    } catch (err) {
      console.log('authUser', err.toString())
    }
    return res.status(401).json({ message: 'Error in token' })
  }
}