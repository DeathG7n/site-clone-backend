const router = require('express').Router()
const Users = require('../models/Users')
const bcrypt = require('bcrypt')

//register
router.post('/register', async (req, res)=>{
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
router.post('/login', async(req, res)=>{
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

module.exports = router