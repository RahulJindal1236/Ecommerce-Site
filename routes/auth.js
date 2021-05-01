const express = require('express')
const authController = require('../controllers/auth')
const router = express.Router()

// router.post('/register', authController.register)
router.post('/login', authController.redirectHome, authController.login)
router.post('/logout', authController.redirectLogin, authController.logout)
router.post('/register', authController.register)
module.exports = router
