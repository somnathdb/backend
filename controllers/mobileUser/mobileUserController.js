const mobileUserModel = require('../../models/mobileUser/mobileUserModel')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const mongoose = require('mongoose')
const keys = require('../../config/keys').keys

exports.addMobileUser = async (req, res, next) => {
    try {
        const body = req.body
        let checkNumber = await mobileUserModel.findOne({
            number: body.number
        })
        if (checkNumber) {
            res.status(400).json({
                title: "error",
                message: "Mobile Number Already Exites",
                status: false
            })
        }else {
            var newUser = new mobileUserModel({
                ...req.body
            })
            let saveData = await newUser.save()
            if (saveData) {
                res.status(201).json({
                    title: "success",
                    message: "User Registartion Successfully Completed",
                    status: true
                })
            }
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

exports.getAllPO_No = async(req,res,next)=>{
    try{
        const body = req.query
        console.log("46",body)
        let PO_Data = await mobileUserModel.find({
            vendorNo:body.vendorNo
        }).select('PO_no')
        if(PO_Data){
            res.status(200).json({
                title: "success",
                message: "Fetch Successfully",
                status: true,
                data:PO_Data
            })
        }

    }catch(err){
        res.status(500).json({
            title: "error",
            message: "Internal Server Error",
            status: false,
            error: err
        })
    }
}


exports.mobileUserLogin = (req, res, next) => {
    const {
        password,
        number
    } = req.body
    console.log("48",req.body)
    mobileUserModel.findOne({
        $and: [{
            number: number
        }]
    }).then(user => {
        if (!user) {
            return res.status(500).json({
                title: "error",
                message: 'User Not Found',
                status: false
            });
        }
        bcrypt.compare(password, user.password).then(async isMatch => {
            if (isMatch) {
                req.session.userInfo = {
                    user: user
                }
                console.log("65",user)
                const payload = {
                    id: user._id,
                    name: user.name,
                    number: user.number,
                    address:user.address,
                    PO_no:user.PO_no,
                    vendorNo:user.vendorNo,
                    GST_no:user.GST_no,
                }
                jwt.sign(
                    payload,
                    keys, {
                        expiresIn: '365d',
                    },
                    (err, token) => {
                        res.locals.userInfo = req.session.userInfo;
                        // res.json({
                        //     payload: payload,
                        //     status: true,
                        //     title: "success",
                        //     message: 'Login successfully',
                        //     token: "Bearer " + token
                        // });
                        res.status(200).json({
                            title: "success",
                            message: 'Login successfully',
                            status: true,
                            data:  token,
                            token: token
                        })
                    }
                );
            } else {
                return res.status(500).json({
                    title: "error",
                    message: 'password is wrong',
                    status: false
                });
            }
        });
    });
}

exports.updateUserPassword = async (req, res, next) => {
    try {
        const body = req.body;
        let records = await mobileUserModel.findOne({
            number: body.number
        })
        if (records) {
            const mobileuser = new mobileUserModel();
            const hashed = await mobileuser.change_password(body.newPassword);
            if (body.newPassword === body.confirmPassword) {
                var data = await mobileUserModel.findOneAndUpdate({
                    _id: records._id
                }, {
                    $set: {
                        password: hashed
                    },
                });
                if (data) {
                    return res.status(200).json({
                        title: "success",
                        message: "User Password Successfully Updated",
                        status: true
                    });
                }
            } else {
                return res.status(401).json({
                    title: "error",
                    message: "New password and confirm password is Mismatch",
                    status: false
                })
            }
        } else {
            return res.status(400).json({
                title: "error",
                message: "Mobile Number Not Exites",
                status: false
            })
        }
    } catch (err) {
        return res.status(200).json({
            title: "error",
            message: "Internal Server Error",
            status: false
        })
    }
};

exports.getAllMobileUser = async (req, res, next) => {
    try {
        let data = await mobileUserModel.find().limit(parseInt(10 * 1)).skip((parseInt(req.query.pageNo) - 1) * 10)
        if (data) {
            res.status(200).json({
                title: "success",
                message: "Data Successfully Fetched",
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

exports.getUserById = async (req, res, next) => {
    try {
        const body = req.query
        let data = await mobileUserModel.findOne({
            _id:body.id
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

exports.updateUserDetails= async (req, res, next) => {
    try {
        const body = req.query;
        let records = await mobileUserModel.findOneAndUpdate({
            _id: body.id
        },{$set:{
            number:body.number,
            name:body.name
        }})
        if (records) {
            return res.status(200).json({
                title: "error",
                message: "Internal Server Error",
                status: false
            })
        } 
    } catch (err) {
        return res.status(200).json({
            title: "error",
            message: "Internal Server Error",
            status: false
        })
    }
};

exports.deleteUserById = async (req, res, next) => {
    try {
        const body = req.query
        let data = await mobileUserModel.findOneAndRemove({
            _id:body.id
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


exports.updateUserById = async (req, res, next) => {
    try {
        const body = req.body
            var updateUsers = await mobileUserModel.findOneAndUpdate({
                _id:body._id
            },{$set:{
                name:body.name,
                number:body.number
            }})
            if (updateUsers) {
                res.status(201).json({
                    title: "success",
                    message: "User Data Successfully Updated",
                    status: true
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
