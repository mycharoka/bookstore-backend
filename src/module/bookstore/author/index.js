const router = require('express').Router()
const auth = require('../../../core/auth/auth')
const authenticate = require('../../../core/auth/service')
const service = require('./service')
const serviceAuth = require('../../../core/auth/service')
const { refreshAuth } = require('./refreshToken')
// const { json } = require('express')


router.post('/login', async (req, res) => {
  // const {email, password} = req.body
  console.log('req body > ', req.body);
  const {Email, Password} = req.body
  let result = await authenticate.passwordIsMatch(Email, Password)
  res.status(result.status_code).json(result.data)
})

router.post('/logout', async (req, res) => {
  res.json('logout')
})

router.post('/register', async (req, res) => {
  const {Name, Pen_Name, Email, Password} = req.body
  let result = await service.registerAuthor(Name, Pen_Name, Email, Password)
  res.status(result.status_code).json(result.data)
})

router.put('/change_password', auth(['admin','author']),async (req, res) => {
  const {Old_Password, New_Password} = req.body
  let result = await service.updatePassword(req.user.user.id, Old_Password, New_Password)
  res.status(result.status_code).json(result.data)
})

router.post('/forgot_password', async (req, res) => {
  let result = await service.forgotPassword(req.body.Email)
  res.status(result.status_code).json(result.data)
})

router.put('/update', auth(['author']),async (req, res) => {
  const {Name, Pen_Name} = req.body
  let result = await service.updateAuthorProfile(Name, Pen_Name, req.user.user.id)
})

router.get('/get_my_profile', auth(['author']),async (req ,res) => {
  const {id} = req.user.user
  let result = await serviceAuth.getLoggedIn(id)
  res.status(result.status_code).json(result.data)
})

router.post('/refresh_token', async (req, res) => {
  const {Refresh_Token} = req.body
  let result = refreshAuth(Refresh_Token)
  res.status(result.status_code).json(result.data)
})

module.exports = router