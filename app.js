const express =  require('express')
const mongoose = require('mongoose')
const multer = require('multer')
const morgan = require('morgan')
const helmet = require('helmet')
const dotenv = require('dotenv')
const cors = require('cors')
const Users = require('./models/Users')
const userRoute = require('./routes/users')
const authRoute = require('./routes/auth')
const dashboardRoute = require('./routes/dashboard')
const router = express.Router()
const path = require('path')
const Transactions = require('./models/Transactions')

const app = express();
dotenv.config()


//Connection 
const database = module.exports = () =>{
    const connectionParams = {
        useUnifiedTopology: true,
    }
    try{
        mongoose.set('strictQuery', false)
        mongoose.connect(process.env.MONGO_URL, connectionParams)
        console.log('Database Connected')
    } catch(err){
        console.log(err)
        console.log('Database not connected')
    }
}

database()

//middleware
app.use(cors())
app.use(express.json())
app.use(helmet())
app.use(morgan('common'))

app.use("/images", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res)=>{
    res.json("Hello")
})

const storage = multer.diskStorage({
    destination: "uploads",
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
  
const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), async(req, res) => {
  try {
    return res.status(200).json("File uploaded successfully"); 
  } catch (error) {
      return res.status(500).json(error);
  }
});


app.use("/api", router)
// app.use('/api/user', userRoute)
// app.use('/api/auth', authRoute)
// app.use('/api/dashboard', dashboardRoute)

//Port
app.listen(8800, ()=>{
    console.log("Backend Listening")
});

//Authentications
//register
router.post('/auth/register', async (req, res)=>{
    const newUser = new Users({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        user_name: req.body.user_name,
        email: req.body.email,
        country: req.body.country,
        mobile: req.body.mobile,
        password: req.body.password
    })
    const existingUser = await Users.findOne({user_name: req.body.user_name})

    if(existingUser){
        res.status(500).json("User already exists")
    } else{
        try{
        const user = await newUser.save()
        res.status(200).json('User account created')
        } catch(err){
            res.status(500).json(err)
        }
    }
    
}) 

//login
router.post('/auth/login', async(req, res)=>{
    try{
        const user = await Users.findOne({user_name: req.body.user_name})
        !user && res.status(404).json("user not found") 

        const validPassword = req.body.password === user.password
        !validPassword && res.status(400).json('wrong password')

        const {password, updatedAt, ...other} = user._doc
        res.status(200).json(other)
    } catch(err){
        res.status(500).json(err)
    }
})

//confirm payment
router.post('/auth/confirm', async (req, res)=>{
    const newTransaction = new Transactions({
        proof: req.body.proof,
        description: req.body.desc,
        amount: req.body.amount,
        type: req.body.type,
        userId: req.body.userId
    })
    const existingUser = await Users.findOne({userId: req.body.userId})

    if(existingUser){
        try{
            const proof = await newTransaction.save()
            res.status(200).json('Proof received')
        } catch(err){
            res.status(500).json(err)
        }
    } else{
        res.status(500).json('Invalid User')
    }
    
}) 

//Dashboard
//get a user
router.get('/user/:id', async(req, res)=>{
    try{
        const user = await Users.findById(req.params.id)
        const {password, updatedAt, ...other} = user._doc
        res.status(200).json(other)
    } catch(err){
        res.status(500).json(err)
    }
})
//get users
router.get('/users', async(req, res)=>{
    try{
        const user = await Users.find({})
        console.log(user)
        res.status(200).json(user)
    } catch(err){
        res.status(500).json(err)
    }
})
//delete user
router.delete('/user/:id', async(req, res)=>{
    if(req.body.userId === req.params.id){
        try{
            const user = await Users.findByIdAndDelete(req.params.id)
            res.status(200).json('Account has been deleted')
        } catch(err){
            res.status(500).json(err)
        }
    } else{
        res.status(403).json("Can only delete your account")
    }
})
//update user
router.put('/user/:id', async(req, res)=>{
    if(req.body.userId === req.params.id){
        try{
            const user = await Users.findByIdAndUpdate(req.params.id, {
                $set : req.body,
            })
            res.status(200).json('Account has been updated')
        } catch(err){
            res.status(500).json(err)
        }
    } else{
        res.status(403).json("Can only update your account")
    }
})

//get pending transactions
router.get('/transactions', async(req, res)=>{
    try{
        const transactions = await Transactions.find({})
        console.log(transactions)
        res.status(200).json(transactions)
    } catch(err){
        res.status(500).json(err)
    }
})

//process transaction
router.put('/confirm/transaction/:id', async(req, res)=>{
    if(req.body.userId === req.params.id){
        try{
            const user = await Users.findByIdAndUpdate(req.params.id)
            await user.updateOne({$push: {details: req.body.details}})
            const transaction = await Transactions.find({userId: req.params.id})
            await transaction[0].updateOne({$set: {processed: req.body.processed}})

            // res.status(200).json('Transaction has been processed')
            res.status(200).json(transaction)
        } catch(err){
            res.status(500).json(err)
            console.log(err)
        }
    } else{
        res.status(403).json("Invalid transaction")
    }
})



