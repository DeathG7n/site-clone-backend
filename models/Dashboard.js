const mongoose = require('mongoose')

const DashboardSchema = new mongoose.Schema({
    depositWalletBalance:{
        type: Number,
        default: 5,
    },
    interestWalletBalance:{
        type: Number,
        default: 0,
    },
    totalInvest:{
        type: Number,
        default: 0,
    },
    totalDeposit:{
        type: Number,
        default: 0,
    },
    totalWithdraw:{
        type: Number,
        default: 0,
    },
    referralEarnings:{
        type: Number,
        default: 0,
    },
},
    {timestamps: true}
)

module.exports = mongoose.model('Dashboard', DashboardSchema)