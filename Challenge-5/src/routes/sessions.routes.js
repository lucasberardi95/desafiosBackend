import { Router } from "express";
import { userModel } from "../models/users.models.js";

const sessionRouter = Router()

sessionRouter.post('/login', async (req, res) => {
    const { email, password } = req.body

    try {
        if (req.session.login)
            res.status(200).send({ result: 'Existing login' })
        const user = await userModel.findOne({ email: email })
        if (user) {
            if (user.password == password) {
                req.session.login = true
                res.redirect('/products', 200, {'info': `Welcome ${user.first_name}`}) //Redireccion
            } else {
                res.status(401).send({ result: 'Unauthorized', message: user })
            }
        } else {
        res.status(404).send({ result: 'Not found', message: user })
        }
    } catch (error) {
        res.status(400).send({ error: `Failed to login: ${error}` })
    }
})

sessionRouter.get('/logout', async (req, res) => {
    if(req.session.login){
        req.session.destroy()
    }
    res.status(200).send({result: 'Deleted login'})
    res.redirect('/login', 200, {'info': 'LOGIN'}) //Redireccion
})

export default sessionRouter