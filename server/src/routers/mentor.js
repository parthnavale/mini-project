const express = require('express')
const mentor = require('../models/mentor')
const auth = require('../middleware/auth')

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
        res.send({ men, token })
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

router.patch('/mentors/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const men = await mentor.findById(req.params.id)

        updates.forEach((update) => men[update] = req.body[update])
        await men.save()

        if (!men) {
            return res.status(404).send()
        }

        res.send(men)
    } catch (e) {
        res.status(400).send(e)
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

module.exports = router
