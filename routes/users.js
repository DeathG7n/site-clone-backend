const router = require('express').Router()
const Users = require('../models/Users')

//get a user
router.get('/:id', async(req, res)=>{
    try{
        const user = await Users.findById(req.params.id)
        const {password, updatedAt, ...other} = user._doc
        res.status(200).json(other)
    } catch(err){
        res.status(500).json(err)
    }
})
//delete user
router.delete('/:id', async(req, res)=>{
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
router.put('/:id', async(req, res)=>{
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

module.exports = router