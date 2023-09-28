import { Router } from "express";
import { userModel } from "../models/users.models.js";
import { validatePassword } from "../utils/bcrypt.js";
import passport from 'passport'
const sessionRouter = Router()
/* 
    const { email, password } = req.body

    try {

        if (req.session.login)
            res.status(200).send({ result: 'Existing login' })
        const user = await userModel.findOne({ email: email })
        if (user) {
            req.session.username = user.first_name
            if (user.email == 'adminCoder@coder.com' && password == '1234') {
                console.log('You are admin')
                req.session.role = 'admin'
            }
            if (validatePassword, user.password) { // 1234 --> 5vt47639bg35h7489 debo tener un modulo que haga esta comparacion por mi, en este caso es bcrypt
                req.session.login = true
                res.redirect(`/static/products?info=${user.first_name}`) //Redirect
            } else {
                res.status(401).send({ result: 'Unauthorized', message: user })
            }
        } else {
        res.status(404).send({ result: 'Not found', message: user })
        }
    } catch (error) {
        res.status(400).send({ error: `Failed to login: ${error}` })
    }
*/
sessionRouter.post('/login', passport.authenticate('login'), async (req, res) => {
    try {
        if (!req.user) {
            if (req.authInfo && req.authInfo.message) {
                return res.status(401).send({ message: req.authInfo.message })
            }
            return res.status(401).send({ message: `Authentication failed` })
        }

        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email
        }
        res.redirect(`/static/products?info=${req.user.first_name}`) //Redirect
        //res.status(200).send({ payload: req.user })
    } catch (error) {
        res.status(500).send({ message: `Failed to login: ${error}` })
    }
})

sessionRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => {
    res.status(200).send({ payload: req.user })
})

sessionRouter.get('/githubSession', passport.authenticate('github'), async (req, res) => {
    req.session.user = req.user
    res.status(200).send({ message: 'Session created' })
})

sessionRouter.get('/logout', async (req, res) => {
    if (req.session.login) {
        req.session.destroy()
    }
    res.redirect(`/static/login`) //Redirect
})

export default sessionRouter