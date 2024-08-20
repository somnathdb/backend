const itemCodeModel = require('../../models/Item/itemCodeModel')
const itemNameModel = require('../../models/Item/itemModel')
const jwt = require("jsonwebtoken")
const keys = require('../../config/keys').keys


exports.addItemCode = async (req, res, next) => {
    try {
        // const token = req.headers.authorization.split(" ")[1];
        // const a = token.slice(1,-1)
        // const decoded = jwt.verify(a, keys)
            var newItem = new itemCodeModel({
                // userId:decoded.id,
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

exports.relatedItem = async (req, res) => {
  const materialCode = req.query.materialCode;
  try {
      const response = await itemCodeModel.find({
          itemCode: materialCode
      });

      if (response.length === 0) {
          return res.status(404).json({
              title: "error",
              message: "No items found for the given material code",
              status: false
          });
      }

      const response1 = await itemNameModel.find({
          _id: response[0].itemId
      });

      console.log("43", response1);
      
      res.status(200).json({
          title: "success",
          message: "Your Item Successfully Fetched",
          status: true,
          data: response1
      });
  } catch (error) {
      console.log("59", error);
      res.status(500).json({
          title: "error",
          message: "Error fetching related items",
          status: false,
          error: error.message
      });
  }
};
