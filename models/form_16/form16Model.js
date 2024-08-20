const mongoose = require('mongoose')
const Schema = mongoose.Schema

const form16Schema = new Schema({
    VendorNo:{
        type:Number
    },
    pan:{
        type:String
    },
    financialYear: {
        type:String
    },
    quarter: {
        type:String
    },
    file:{
        type:String
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('form16', form16Schema)