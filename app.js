const express =  require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const helmet = require('helmet')
const dotenv = require('dotenv')
const cors = require('cors')
const userRoute = require('./routes/users')
const authRoute = require('./routes/auth')
const dashboardRoute = require('./routes/dashboard')

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

app.use('/api/user', userRoute)
app.use('/api/auth', authRoute)
app.use('/api/dashboard', dashboardRoute)

//Port
app.listen(8800, ()=>{
    console.log("Backend Listening")
});