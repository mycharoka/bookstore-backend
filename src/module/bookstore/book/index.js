const router = require('express').Router()
const auth = require('../../../core/auth/auth')
const service = require('./service')
const repo = require('./repository')

router.post('/add', auth(['author']), async (req, res) => {
  const {Title, Summary, Price, Stock, Cover_Image_Base64, Image_Extension} = req.body
  const {id} = req.user.user
  let result = await service.addBook(Title, Summary, Price, Stock, Cover_Image_Base64, Image_Extension, id)
  res.status(result.status_code).json(result.data)

})

router.get('/get/:id', async (req, res) => {
  let result = await service.getBook(req.params.id)
  res.status(result.status_code).json(result.data)
})

router.get('/get', async (req, res) => {
  const {Page, Limit, Title, Author_ID} = req.query
  let result = await repo.paginationBook(parseInt(Page), parseInt(Limit), Title, parseInt(Author_ID))
})

router.put('/update/:id', auth(['author']), async (req, res) => {
  const {Title, Summary, Price, Stock} = req.body
  let result = await service.updateBookByID(req.params.id, Title, Summary, Price, Stock)
  res.status(result.status_code).json(result.data)
})

module.exports = router