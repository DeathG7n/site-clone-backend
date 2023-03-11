const mongoose = require('mongoose')

const TransactionsSchema = new mongoose.Schema({
    proof:{
        type: String,
        default: "",
    }, 
    amount:{
        type: Number,
        default: 0
    },
    type:{
        type: String,
        default: ''
    },
    userId:{
        type: String,
        default: ''
    },
    description:{
        type: String,
        default: ''
    },
    processed:{
        type: Boolean,
        default: false
    }

},
    {timestamps: true}
)

module.exports = mongoose.model('Transactions', TransactionsSchema)