const mongoose = require('mongoose')
const Schema = mongoose.Schema


const itemCode = new Schema({
    // userId:{
    //     type:mongoose.Types.ObjectId
    // },
    itemId: {
        type: mongoose.Types.ObjectId,
        require:true
    },
    itemCode:{
        type:String
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('itemcodes', itemCode)