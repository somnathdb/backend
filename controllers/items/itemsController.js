const itemModel = require('../../models/Item/itemModel')
const jwt = require("jsonwebtoken")
const keys = require('../../config/keys').keys


exports.addItem = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const a = token.slice(1,-1)
        const decoded = jwt.verify(a, keys)
            var newItem = new itemModel({
                userId:decoded.id,
                 ...req.body
            })
            let saveData = await newItem.save()
            if (saveData) {
                    res.status(200).json({
                        title: "success",
                        message: "Your Item Successfully Added",
                        status: true
                    })
            }
      
    } catch (err) {
        // res.status(500).json({
        //     title: "error",
        //     message: "Internal Server Error",
        //     status: false,
        //     error: err
        // })
        console.log(err)
    }
}

exports.getAllItem = async (req, res, next) => {
    try {

        let data = await itemModel.find({active:true})
        if (data) {
            res.status(200).json({
                title: "success",
                message: "All Items Successfully Fetched",
                status: true,
                data: data
            })
        }
    } catch (err) {
        // res.status(200).json({
        //     title: "error",
        //     message: "Internal Server Error",
        //     status: false,
        //     error: err
        // })
        console.log(err)
    }
}

exports.deleteItemById = async (req, res, next) => {
    try {
        const body = req.query
        let data = await itemModel.findOneAndUpdate({
            _id: body.id
        },{$set:{
            active:false
        }})
        if (data) {
            res.status(200).json({
                title: "success",
                message: "Data Successfully Deleted",
                status: true,
                data: data
            })
        }
    } catch (err) {
        res.status(200).json({
            title: "error",
            message: "Internal Server Error",
            status: false,
            error: err
        })
    }
}

exports.getItemById = async (req, res, next) => {
    try {
        const body = req.query
        let data = await itemModel.findOne({
            _id: body.id
        })
        if (data) {
            res.status(200).json({
                title: "success",
                message: "Data Successfully Fetched",
                status: true,
                data: data
            })
        }
    } catch (err) {
        res.status(200).json({
            title: "error",
            message: "Internal Server Error",
            status: false,
            error: err
        })
    }
}

exports.updateItemById = async (req, res, next) => {
    try {
        const body = req.body;
        let updateItem = await itemModel.findOneAndUpdate({
            _id: body._id
        }, {
            $set: {
                ...req.body
            }
        })
        if (updateItem) {
                res.status(200).json({
                    title: "success",
                    message: "Your item Successfully updated",
                    status: true
                })
            }
        
    } catch (err) {
        // res.status(500).json({
        //     title: "error",
        //     message: "Internal Server Error",
        //     status: false,
        //     error: err
        // })
        console.log("273",err)
    }
}