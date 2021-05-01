const express = require('express')
const authController = require('../controllers/auth')
const authControl = require('../controllers/user')
const router = express.Router()

router.get('/', authController.redirectLogin, authControl.allItems)
router.get('/view/:id', authController.redirectLogin, authControl.viewItem)
router.get('/delete/:id', authController.redirectLogin, authControl.delete)
router.get('/cancel/:id', authController.redirectLogin, authControl.cancelItem)
router.post('/sell', authController.redirectLogin, authControl.sell)
router.post('/search', authController.redirectLogin, authControl.search)
router.get('/buy/:id', authController.redirectLogin, authControl.buy)
module.exports = router
