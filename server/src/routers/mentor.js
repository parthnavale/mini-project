const express = require('express')
const mentor = require('../models/mentor')
const auth = require('../middleware/auth')
const auth1 = require('../middleware/auth1')

const router = new express.Router()

router.post('/mentors', async (req, res) => {
    const men = new mentor(req.body)

    try {
        await men.save()
        const token = await men.generateAuthToken()
        res.status(201).send({ men , token })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/mentors/login', async (req, res) => {
    try {
        const men = await mentor.findByCredentials(req.body.email, req.body.password)
        const token = await men.generateAuthToken()
        const {_id,name,email,Field,linkedinProfile,pic} = men;
        res.json({ user:{_id,name,email,Field,linkedinProfile,pic}, token })
    } catch (e) {
        res.status(400).send()
    }
})

router.get('/mentors/me', auth, async (req, res) => {
    res.send(req.stu) 
})

router.get('/mentors/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const men = await mentor.findById(_id)

        if (!men) {
            return res.status(404).send()
        }

        res.send(men)
    } catch (e) {
        res.status(500).send()
    }
})

router.delete('/mentors/:id', async (req, res) => {
    try {
        const men = await mentor.findByIdAndDelete(req.params.id)

        if (!men) {
            return res.status(404).send()
        }

        res.send(men)
    } catch (e) {
        res.status(500).send()
    }
})

router.put('/mentors/updatepic',auth1,(req,res)=>{
    mentor.findByIdAndUpdate(req.men._id,{$set:{pic:req.body.pic}},{new:true},
        (err,result)=>{
         if(err){
             return res.status(422).json({error:"pic canot post"})
         }
         res.json(result)
    })
})

router.patch('/mentors/me', auth1 , async (req, res) => {
    console.log('Hii');
    console.log(req.body);

    const updates = Object.keys(req.body)
    console.log(updates);
    const allowedUpdates = ['name', 'email', 'password', 'Field', 'linkedinProfile']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        console.log('Hii1');
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        //const stu = await student.findById(req.params.id)
        
        updates.forEach((update) => req.men[update] = req.body[update])
        await req.men.save()
        console.log(Hii3);
        // if (!stu) {
        //     return res.status(404).send()
        // }
        
        res.json(req.men);
    } catch (e) {
        console.log('Hii2')
        res.status(400).send(e)
    }
})

router.get('/getmentors' ,auth, async (req,res) =>{
    try{
        const mentors= await mentor.find()
        res.json({mentors});
    }catch(e)
    {
        res.status(404).send(e);
    }
})

module.exports = router
