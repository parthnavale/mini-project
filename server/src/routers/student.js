const express = require('express')
const student = require('../models/student')
const auth = require('../middleware/auth')
const auth1 = require('../middleware/auth1');

const router = new express.Router()

router.post('/students', async (req, res) => {
    const stu = new student(req.body)

    try {
        await stu.save()
        const token = await stu.generateAuthToken()
        res.status(201).send({ stu , token })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/students/login', async (req, res) => {
    try {
        const stu = await student.findByCredentials(req.body.email, req.body.password)
        const token = await stu.generateAuthToken();
        const {_id,name,email,branch,linkedinProfile,pic} = stu;
        res.json({ user:{_id,name,email,branch,linkedinProfile,pic}, token })
    } catch (e) {
        res.status(400).json({error:"Invalid Email or password"})
    }
})

router.post('/students/logout', auth , async (req , res) =>{
    try{
        req.stu.tokens=req.stu.tokens.filter((token) =>{
            return token.token !== req.token
        })
        await req.stu.save();

        res.send();
    } catch(e)
    {
        res.status(500).send();
    }
})

router.post('/students/logoutall', auth , async (req,res) => {
    try{
        req.stu.tokens=[];
        await req.stu.save();

        res.send();
    }catch(e)
    {
        res.status(500).send();
    }
})

router.get('/students/me', auth, async (req, res) => {
    res.send(req.stu) 
})

router.get('/students/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const stu = await student.findById(_id)

        if (!stu) {
            return res.status(404).send()
        }

        res.send(stu)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/students/me', auth , async (req, res) => {
    console.log(req.body);

    const updates = Object.keys(req.body)
    console.log(updates);
    const allowedUpdates = ['name', 'email', 'password', 'branch', 'linkedinProfile']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        console.log('Hii1');
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        //const stu = await student.findById(req.params.id)
        
        updates.forEach((update) => req.stu[update] = req.body[update])
        await req.stu.save()
        console.log(Hii3);
        // if (!stu) {
        //     return res.status(404).send()
        // }
        
        res.json(req.stu);
    } catch (e) {
        console.log('Hii2')
        res.status(400).send(e)
    }
})

router.delete('/students/me', auth, async (req, res) => {

    try {
        //const stu = await student.findByIdAndDelete(req.stu._id)

        // if (!stu) {
        //     return res.status(404).send()
        // }

        await req.stu.remove();
        res.send(req.stu);
    } catch (e) {
        res.status(500).send()
    }
})

router.put('/students/updatepic',auth,(req,res)=>{
    console.log(req);
    student.findByIdAndUpdate(req.stu._id,{$set:{pic:req.body.pic}},{new:true},
        (err,result)=>{
         if(err){
             return res.status(422).json({error:"pic canot post"})
         }
         res.json(result)
    })
})

module.exports = router