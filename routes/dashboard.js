const router = require('express').Router()
const Users = require('../models/Users')

//get  dashboard
router.get('/:id', async(req, res)=>{
    try{
        const user = await Dashboard.findById(req.params.id)
        res.status(200).json(user)
    } catch(err){
        res.status(500).json(err)
    }
})

module.exports = router