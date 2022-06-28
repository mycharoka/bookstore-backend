const auth = require('../../core/auth/auth')

const router = require('express').Router()

router.get('/', auth(['admin', 'author']), async (req, res) => {
  res.json('OKAY')
})

module.exports = router