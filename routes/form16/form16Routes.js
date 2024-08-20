const express = require("express")
const router = express.Router()
const form16Controller = require('../../controllers/form_16/form16Controller')


router.post('/UserLogin', form16Controller.UserLogin)

router.post('/proxy', form16Controller.convData)



module.exports = router