const express = require('express')
const authController = require('../controllers/auth')
const authControl = require('../controllers/user')
const authAdminControl = require('../controllers/admin')
const router = express.Router()

router.get('/view/:id', authController.redirectLogin, authAdminControl.viewItem)
router.get(
  '/delivered/:id',
  authController.redirectLogin,
  authAdminControl.delivered
)
router.get('/cancel/:id', authController.redirectLogin, authAdminControl.cancel)

module.exports = router
