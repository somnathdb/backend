const express = require("express")
const router = express.Router()
const itemCodeController= require("../../controllers/items/itemCodeController")

router.post('/addItemCode', itemCodeController.addItemCode)

router.get('/relatedItem', itemCodeController.relatedItem)

module.exports = router