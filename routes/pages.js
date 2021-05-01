const express = require('express')
const authController = require('../controllers/auth')
const authControl = require('../controllers/user')
const router = express.Router()
const db = require('../model/db')
router.get('/', (req, res) => {
  let { userId } = req.session
  res.render('index', { user: userId })
})
router.get('/about', (req, res) => {
  res.render('about')
})
router.get('/register', (req, res) => {
  res.render('register', { message: '' })
})
router.get('/sellItem', authController.redirectLogin, (req, res) => {
  res.render('sellItem')
})
router.get(
  '/myproducts',
  authController.redirectLogin,
  authControl.getMyProducts
)
router.get('/admin', authController.redirectLogin, authControl.admin)
router.get('/myorders', authController.redirectLogin, authControl.myorders)
module.exports = router
