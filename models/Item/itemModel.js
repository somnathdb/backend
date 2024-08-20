const mongoose = require('mongoose')
const Schema = mongoose.Schema


const itemName = new Schema({
    userId:{
        type:mongoose.Types.ObjectId
    },
    itemName: {
        type: String,
        default:null
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('itemnames', itemName)