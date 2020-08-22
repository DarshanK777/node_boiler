// handle user data / updation
const express = require('express')
const User = require('../models/user')
const router = express.Router();
const authMiddleware = require('../utils/authMiddleware')


// read user
router.get('/me', authMiddleware ,async (req, res)=>{
    try {
        res.send(req.user)    
    } catch (error) {
        res.send(error)
    }
    
})

// read user by username
router.get('/:username', authMiddleware, async (req, res)=>{
    const username = req.params.username
    try{
        const user = await User.findOne({username: username })
        if(!user){
            return res.status(404).send("User not found")
        }
        const friends = await Friends.exists({user_id : req.user._id, following_user_id : user._id})

        res.send({...user.toJSON(), following : friends})
    } catch(e){
        res.status(500).send("Internal server error")
    }
})

//update user
router.patch('/me', authMiddleware, async (req, res)=>{
    // this checks for the fields which can be updated
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'username']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try{
        updates.forEach((update)=>{
            req.user[update] = req.body[update]

        })
        await req.user.save()
        res.send(user)
    }catch(e){
        res.status(400).send()
    }
})

// delete user
router.delete('/me', authMiddleware, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user._id)

        await req.user.remove() //does same as above
        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})


module.exports = router