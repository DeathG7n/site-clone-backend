const mongoose = require('mongoose')
const { 
    v1: uuidv1,
    v4: uuidv4,
} = require('uuid')

const UserSchema = new mongoose.Schema({
    profile_picture:{
        type: String,
        default: ''
    },
    first_name:{
        type: String,
        required: true,
        min: 3,
    },
    last_name:{
        type: String,
        required: true,
        min: 3,
    },
    user_name:{
        type: String,
        required: true,
        min: 3,
        max: 20,
        unique: true,
    },
    userId:{
        type: String,
    },
    email:{
        type: String,
        required: true,
        min: 3,
    },
    password:{
        type: String,
        required: true,
        min: 8,
    },
    mobile:{
        type: Number,
        required: true,
    },
    country:{
        type: String,
        required: true,
        min: 3,
    },
    address:{
        type: String,
        required: false,
        min: 10,
    },
    state:{
        type: String,
        required: false,
        min: 3,
    },
    zip:{
        type: Number,
        required: false,
        min: 3,
    },
    city:{
        type: String,
        required: false,
        min: 3,
    },
    dashboard:{
        type: Object,
        default: {
            depositWalletBalance: 5,
            interestWalletBalance: 0,
            totalInvest: 0,
            totalDeposit: 0,
            totalWithdraw: 0,
            referralEarnings: 0,
            details:[
                {
                    amount: 5,
                    wallet: 'Deposit Wallet',
                    desc: 'You have got Sign Up Bonus',
                }
            ]
        }
    }
},
    {timestamps: true}
)

module.exports = mongoose.model('Users', UserSchema)