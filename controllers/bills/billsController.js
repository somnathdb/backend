const billModel = require('../../models/bills/billsModel')
const jwt = require("jsonwebtoken")
const mongoose = require('mongoose')
const keys = require('../../config/keys').keys
const qrcode = require('qrcode');
const path = require('path');
const fs = require('fs');
const AWS = require('aws-sdk');
const { promisify } = require('util');
const pdf = require('html-pdf-node');



exports.getAllBills = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const a = token.slice(1,-1)
        const decoded = jwt.verify(a, keys)
        console.log(decoded.id)
        let data = await billModel.find({userId:decoded.id}).sort({_id:-1})
        if (data) {
            res.status(200).json({
                title: "success",
                message: "All Bills Successfully Fetched",
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

exports.deleteBillById = async (req, res, next) => {
    try {
        const body = req.query
        let data = await billModel.findOneAndUpdate({
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

exports.getAllDeleteBills = async (req, res, next) => {
    try {
        let data = await billModel.find({active:false}).sort({_id:-1})
        if (data) {
            res.status(200).json({
                title: "success",
                message: "All Bills Successfully Fetched",
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

// exports.getBillById = async (req, res, next) => {
//     try {
//         const body = req.query
//         let data = await billModel.findOne({
//             _id: body.id
//         })
//         if (data) {
//             res.status(200).json({
//                 title: "success",
//                 message: "Data Successfully Fetched",
//                 status: true,
//                 data: data
//             })
//         }
//     } catch (err) {
//         res.status(200).json({
//             title: "error",
//             message: "Internal Server Error",
//             status: false,
//             error: err
//         })
//     }
// }


// exports.getBillById = async (req, res, next) => {
//     try {
//         const body = req.query
//         let data = await billModel.aggregate([
//             {
//             $match:{_id: mongoose.Types.ObjectId(body.id)}
//         },
//         {
//             $addFields: {
//                 Material_Code1_ObjectId: { $toObjectId: "$Material_Code1" }
//             }
//         },
//         {
//             $lookup: {
//                 from: 'itemnames',
//                 localField: 'Material_Code1_ObjectId',
//                 foreignField: '_id',
//                 as: 'Material_Code1_data'
//             }
//         },
//         {
//             $unwind: {
//                 path: '$Material_Code1_data',
//                 preserveNullAndEmptyArrays: true
//               }
//         },
//         {
//             $addFields: {
//                 Material_Code2_ObjectId: { $toObjectId: "$Material_Code2" }
//             }
//         },
//         {
//             $lookup:{
//                 from: 'itemnames',
//                 localField: 'Material_Code2_ObjectId',
//                 foreignField: '_id',
//                 as: 'Material_Code2_data'
//             }
//         },
//         {
//             $unwind: {
//                 path: '$Material_Code2_data',
//                 preserveNullAndEmptyArrays: true
//               }
//         },
//         {
//             $addFields: {
//                 Material_Code3_ObjectId: { $toObjectId: "$Material_Code3" }
//             }
//         },
//         {
//             $lookup:{
//                 from: 'itemnames',
//                 localField: 'Material_Code3_ObjectId',
//                 foreignField: '_id',
//                 as: 'Material_Code3_data'
//             }
//         },
//         {
//             $unwind: {
//                 path: '$Material_Code3_data',
//                 preserveNullAndEmptyArrays: true
//               }
//         },
//         {
//             $addFields: {
//                 Material_Code4_ObjectId: { $toObjectId: "$Material_Code4" }
//             }
//         },
//         {
//             $lookup:{
//                 from: 'itemnames',
//                 localField: 'Material_Code4_ObjectId',
//                 foreignField: '_id',
//                 as: 'Material_Code4_data'
//             }
//         },
//         {
//             $unwind: {
//                 path: '$Material_Code4_data',
//                 preserveNullAndEmptyArrays: true
//               }
//         },
//         {
//             $addFields: {
//                 Material_Code5_ObjectId: { $toObjectId: "$Material_Code5" }
//             }
//         },
//         {
//             $lookup:{
//                 from: 'itemnames',
//                 localField: 'Material_Code5_ObjectId',
//                 foreignField: '_id',
//                 as: 'Material_Code5_data'
//             }
//         },
//         {
//             $unwind: {
//                 path: '$Material_Code5_data',
//                 preserveNullAndEmptyArrays: true
//               }
//         }
//     ])
//         if (data) {
//             res.status(200).json({
//                 title: "success",
//                 message: "Data Successfully Fetched",
//                 status: true,
//                 data: data
//             })
//         }
//     } catch (err) {
//         // res.status(200).json({
//         //     title: "error",
//         //     message: "Internal Server Error",
//         //     status: false,
//         //     error: err
//         // })
//         console.log(err)
//     }
// }


exports.getBillById = async (req, res, next) => {
    try {
        const body = req.query;
        let data = await billModel.aggregate([
            {
                $match: { _id: mongoose.Types.ObjectId(body.id) }
            },
            {
                $addFields: {
                    Material_Code1_ObjectId: {
                        $cond: {
                            if: {
                                $and: [
                                    { $ne: ["$Material_Code1", ""] },
                                    { $eq: [{ $strLenCP: "$Material_Code1" }, 24] }
                                ]
                            },
                            then: { $toObjectId: "$Material_Code1" },
                            else: null
                        }
                    },
                    Material_Code2_ObjectId: {
                        $cond: {
                            if: {
                                $and: [
                                    { $ne: ["$Material_Code2", ""] },
                                    { $eq: [{ $strLenCP: "$Material_Code2" }, 24] }
                                ]
                            },
                            then: { $toObjectId: "$Material_Code2" },
                            else: null
                        }
                    },
                    Material_Code3_ObjectId: {
                        $cond: {
                            if: {
                                $and: [
                                    { $ne: ["$Material_Code3", ""] },
                                    { $eq: [{ $strLenCP: "$Material_Code3" }, 24] }
                                ]
                            },
                            then: { $toObjectId: "$Material_Code3" },
                            else: null
                        }
                    },
                    Material_Code4_ObjectId: {
                        $cond: {
                            if: {
                                $and: [
                                    { $ne: ["$Material_Code4", ""] },
                                    { $eq: [{ $strLenCP: "$Material_Code4" }, 24] }
                                ]
                            },
                            then: { $toObjectId: "$Material_Code4" },
                            else: null
                        }
                    },
                    Material_Code5_ObjectId: {
                        $cond: {
                            if: {
                                $and: [
                                    { $ne: ["$Material_Code5", ""] },
                                    { $eq: [{ $strLenCP: "$Material_Code5" }, 24] }
                                ]
                            },
                            then: { $toObjectId: "$Material_Code5" },
                            else: null
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: 'itemnames',
                    localField: 'Material_Code1_ObjectId',
                    foreignField: '_id',
                    as: 'Material_Code1_data'
                }
            },
            {
                $unwind: {
                    path: '$Material_Code1_data',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'itemnames',
                    localField: 'Material_Code2_ObjectId',
                    foreignField: '_id',
                    as: 'Material_Code2_data'
                }
            },
            {
                $unwind: {
                    path: '$Material_Code2_data',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'itemnames',
                    localField: 'Material_Code3_ObjectId',
                    foreignField: '_id',
                    as: 'Material_Code3_data'
                }
            },
            {
                $unwind: {
                    path: '$Material_Code3_data',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'itemnames',
                    localField: 'Material_Code4_ObjectId',
                    foreignField: '_id',
                    as: 'Material_Code4_data'
                }
            },
            {
                $unwind: {
                    path: '$Material_Code4_data',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'itemnames',
                    localField: 'Material_Code5_ObjectId',
                    foreignField: '_id',
                    as: 'Material_Code5_data'
                }
            },
            {
                $unwind: {
                    path: '$Material_Code5_data',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    userId: 1,
                    name: 1,
                    number: 1,
                    address: 1,
                    PO_no: 1,
                    vendorNo:1,
                    Line_Item_No: 1,
                    Challan_No: 1,
                    Vehicle_No: 1,
                    Material_Code1: 1,
                    Material_Code2: 1,
                    Material_Code3: 1,
                    Material_Code4: 1,
                    Material_Code5: 1,
                    Material_TCode1: 1,
                    Material_TCode2: 1,
                    Material_TCode3: 1,
                    Material_TCode4: 1,
                    Material_TCode5: 1,
                    Quantity1: 1,
                    Quantity2: 1,
                    Quantity3: 1,
                    Quantity4: 1,
                    Quantity5: 1,
                    RQuantity1: 1,
                    RQuantity2: 1,
                    RQuantity3: 1,
                    RQuantity4: 1,
                    RQuantity5: 1,
                    billStatus: 1,
                    TQuantity1: 1,
                    TQuantity2: 1,
                    TQuantity3: 1,
                    TQuantity4: 1,
                    TQuantity5: 1,
                    Qr_Code_URL: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    ExchallanDate1:1,
                    ExchallanDate2:1,
                    ExchallanDate3:1,
                    ExchallanDate4:1,
                    ExchallanDate5:1,
                    ExchallanDate6:1,
                    ExchallanDate7:1,
                    ExchallanDate8:1,
                    ExchallanDate9:1,
                    ExchallanDate10:1,
                    Exchallan1:1,
                    Exchallan2:1,
                    Exchallan3:1,
                    Exchallan4:1,
                    Exchallan5:1,
                    Exchallan6:1,
                    Exchallan7:1,
                    Exchallan8:1,
                    Exchallan9:1,
                    Exchallan10:1,
                    ExQuantity1:1,
                    ExQuantity2:1,
                    ExQuantity3:1,
                    ExQuantity4:1,
                    ExQuantity5:1,
                    ExQuantity6:1,
                    ExQuantity7:1,
                    ExQuantity8:1,
                    ExQuantity9:1,
                    ExQuantity10:1,
                    Painting:1,
                    FinalFettling:1,
                    __v: 1,
                    Material_Code1_data: '$Material_Code1_data.itemName',
                    Material_Code2_data: '$Material_Code2_data.itemName',
                    Material_Code3_data: '$Material_Code3_data.itemName',
                    Material_Code4_data: '$Material_Code4_data.itemName',
                    Material_Code5_data: '$Material_Code5_data.itemName',
                }
            }
        ]);

        if (data && data.length > 0) {
            res.status(200).json({
                title: "success",
                message: "Data Successfully Fetched",
                status: true,
                data: data[0]
            });
        } else {
            res.status(404).json({
                title: "error",
                message: "Bill not found",
                status: false
            });
        }
    } catch (err) {
        res.status(500).json({
            title: "error",
            message: "Internal Server Error",
            status: false,
            error: err.message
        });
        console.log(err);
    }
};


// exports.updateBillById = async (req, res, next) => {
//     try {
//         const body = req.body;
//         const token = req.headers.authorization.split(" ")[1];
//         const a = token.slice(1,-1)
//         const decoded = jwt.verify(a, keys)
//         console.log("decoded",decoded.id)
//         let updateTotal = await billModel.findOneAndUpdate({
//             _id: body._id
//         }, {
//             $set: {
//                 name:decoded.name,
//                 number:decoded.number,
//                 userId:decoded.id,
//                 ...req.body
//             }
//         })
//         if (updateTotal) {
//             res.status(200).json({
//                 title: "success",
//                 message: "Your bill Successfully Updated",
//                 status: true,
//                 data:updateTotal
//             })
//         }
//     } catch (err) {
//         // res.status(500).json({
//         //     title: "error",
//         //     message: "Internal Server Error",
//         //     status: false,
//         //     error: err
//         // })
//         console.log("273",err)
//     }
// }

exports.updateBillById = async (req, res, next) => {
    try {
        const body = req.body;
        const token = req.headers.authorization.split(" ")[1];
        const a = token.slice(1,-1);
        const decoded = jwt.verify(a, keys);      
        // Find and update the bill
        let updateTotal = await billModel.findOneAndUpdate({
            _id: body._id
        }, {
            $set: {
                    name: decoded.name,
                    number: decoded.number,
                    userId: decoded.id,
                    address: decoded.address,
                    ...req.body
            }
        });
        if (updateTotal) {
            const qrCodeData = JSON.stringify({ 
                userId: updateTotal.userId,
                PO_no: updateTotal.PO_no,
                Line_Item_No: updateTotal.Line_Item_No,
                Challan_No: updateTotal.Challan_No,
                Vehicle_No: updateTotal.Vehicle_No,
                Material_Code1: updateTotal.Material_Code1,
                Quantity1: updateTotal.Quantity1,
                Material_Code2: updateTotal.Material_Code2,
                Quantity2: updateTotal.Quantity2,
                Material_Code3: updateTotal.Material_Code3,
                Quantity3: updateTotal.Quantity3,
                Material_Code4: updateTotal.Material_Code4,
                Quantity4: updateTotal.Quantity4,
                Material_Code5: updateTotal.Material_Code5,
                Quantity5: updateTotal.Quantity5
            });
            const qrCodePath = path.join(__dirname, 'qrcodes', `${updateTotal._id}.png`);
                 // Ensure the directory exists
                 const dir = path.dirname(qrCodePath);
                 if (!fs.existsSync(dir)) {
                     fs.mkdirSync(dir, { recursive: true });
                 }
                 await qrcode.toFile(qrCodePath, qrCodeData);
                 const qrCodeFile = await readFileAsync(qrCodePath);
                 const uploadParams = {
                    Bucket: "challengesimages",
                    Key: `qrcodes/${updateTotal._id}.png`,
                    Body: qrCodeFile,
                    ContentType: 'image/png'
                };
                const s3Response = await s3.upload(uploadParams).promise();
                const qrCodeUrl = s3Response.Location;
                await billModel.findOneAndUpdate(
                    { _id: updateTotal._id },
                    { $set: { Qr_Code_URL: qrCodeUrl } }
                );    
                res.status(200).json({
                    title: "success",
                    message: "Your bill Successfully Updated",
                    status: true,
                    data:updateTotal
                });
        }
    } catch (err) {
        console.log("273", err);
        res.status(500).json({
            title: "error",
            message: "Internal Server Error",
            status: false,
            error: err
        });
    }
};




exports.getPendingBills = async (req, res, next) => {
    try {
        let data = await billModel.find({billStatus:"Pending"}).sort({_id:-1})
        if (data) {
            res.status(200).json({
                title: "success",
                message: "All Bills Successfully Fetched",
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

exports.getCompletedBills = async (req, res, next) => {
    try {
        let data = await billModel.find({billStatus:"Completed"}).sort({_id:-1})
        if (data) {
            res.status(200).json({
                title: "success",
                message: "All Bills Successfully Fetched",
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

exports.getReportsBills = async (req, res, next) => {
    try {
        const { startDate, endDate,partyName } = req.body;
        console.log("486",req.body)
        if(partyName === ""){
            // Parse the start and end dates
            const start = new Date(startDate);
            const end = new Date(endDate);

            // Adjust the end date to include all bills on the end date
            end.setDate(end.getDate() + 1);

            // Query the database for bills between the start and end dates
            let data = await billModel.find({
                // billStatus: "Completed",
                createdAt: { $gte: start, $lt: end }
            }).sort({_id:-1})

            if (data) {
                console.log("563",data)
                res.status(200).json({
                    title: "success",
                    message: "Completed Bills Successfully Fetched",
                    status: true,
                    data: data
                });
            }
        }else{
            var search = req.body.partyName;
            console.log("573",search)
            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setDate(end.getDate() + 1);
            if (search == "" || search == null) {
                search_query = {
                    "partyName": {
                        $ne: null
                    }
                };
            } else {
                search_query = {
                    $or: [{
                        "partyName": {
                            $regex: new RegExp(".*" + search + ".*", "i")
                        }
                    }],
                    createdAt: { $gte: start, $lt: end }
                };
                
                let data = await billModel.find(search_query).sort({_id: -1});
                
                if (data) {
                    console.log("563", data);
                    res.status(200).json({
                        title: "success",
                        message: "Completed Bills Successfully Fetched",
                        status: true,
                        data: data
                    });
                }
            }   
        }
    } catch (err) {
        // res.status(500).json({
        //     title: "error",
        //     message: "Internal Server Error",
        //     status: false,
        //     error: err.message
        // });
        console.log(err)
    }
};


exports.getPendingBillsCount = async (req, res, next) => {
    try {
        let data = await billModel.find({billStatus:"Pending"});
        if (data) {
            res.status(200).json({
                title: "success",
                message: "All Bills Successfully Fetched",
                status: true,
                data: data.length
            });
        }
    } catch (err) {
        res.status(500).json({
            title: "error",
            message: "Internal Server Error",
            status: false,
            error: err
        });
    }
};

exports.getCompletedBillsAmount = async (req, res, next) => {
    try {
        let data = await billModel.find({ billStatus: "Completed" });

        if (data) {
            // Calculate the sum of the Total11 field
            let totalSum = data.reduce((acc, bill) => acc + bill.Total11, 0);

            res.status(200).json({
                title: "success",
                message: "Completed Bills Successfully Fetched",
                status: true,
                data: totalSum
            });
        }
    } catch (err) {
        res.status(500).json({
            title: "error",
            message: "Internal Server Error",
            status: false,
            error: err
        });
    }
};

exports.getAllBillsCount = async (req, res, next) => {
    try {
        let data = await billModel.find({})
        if (data) {
            res.status(200).json({
                title: "success",
                message: "All Bills Successfully Fetched",
                status: true,
                data: data.length
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

exports.getCompletedBillsCount = async (req, res, next) => {
    try {
        let data = await billModel.find({billStatus:"Completed"});
        if (data) {
            res.status(200).json({
                title: "success",
                message: "All Bills Successfully Fetched",
                status: true,
                data: data.length
            });
        }
    } catch (err) {
        res.status(500).json({
            title: "error",
            message: "Internal Server Error",
            status: false,
            error: err
        });
    }
};

exports.search = async (req, res, next) => {
    try {
        const {partyName } = req.body;
            var search = req.body.partyName;
            console.log("573",search)
            if (search == "" || search == null) {
                search_query = {
                    "partyName": {
                        $ne: null
                    }
                };
            } else {
                search_query = {
                    $or: [{
                        "partyName": {
                            $regex: new RegExp(".*" + search + ".*", "i")
                        }
                    }],
                };
                
                let data = await billModel.find(search_query).sort({_id: -1});
                
                if (data) {
                    console.log("563", data);
                    res.status(200).json({
                        title: "success",
                        message: "Completed Bills Successfully Fetched",
                        status: true,
                        data: data
                    });
                }
            }   
        
    } catch (err) {
        // res.status(500).json({
        //     title: "error",
        //     message: "Internal Server Error",
        //     status: false,
        //     error: err.message
        // });
        console.log(err)
    }
};

exports.getAllBillsGroupBy = async (req, res, next) => {
    try {
        const data = await billModel.aggregate([
            {
                $group: {
                    _id: "$partyName",
                    partyName: { $first: "$partyName" }, // Get the partyName from the grouped data
                    invoiceNumbers: { $push: "$invoiceNumber" } // Collect invoice numbers for each partyName
                }
            },
            {
                $sort: { _id: -1 } // Sort by _id in descending order
            },
            {
                $project: {
                    _id: 1, // Exclude the _id field
                    partyName: 1, // Include the partyName field
                    invoiceNumbers: 1 // Include the invoiceNumbers field
                }
            }
        ]);
        if (data) {
            res.status(200).json({
                title: "success",
                message: "All Bills Successfully Fetched",
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

exports.getLadgerBillById = async (req, res, next) => {
    try {
        const currentDate = new Date();
        const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const body = req.query
        let data = await billModel.find({
            partyName: body.partyName,
            createdAt: {
                $gte: startDate,
                $lte: endDate   
            }
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