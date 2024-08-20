const express = require("express")
const router = express.Router()
const itemController= require("../../controllers/items/itemsController")

router.post('/addItem', itemController.addItem)

router.post('/updateItemById', itemController.updateItemById)

router.get('/deleteItemById', itemController.deleteItemById)

router.post('/getAllItem', itemController.getAllItem)

router.get('/getItemById', itemController.getItemById)

module.exports = router