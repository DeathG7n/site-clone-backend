const mongoose = require('mongoose')

const TransactionsSchema = new mongoose.Schema({
    
},
    {timestamps: true}
)

module.exports = mongoose.model('Transactions', TransactionsSchema)