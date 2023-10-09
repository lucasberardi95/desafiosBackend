import { Router } from "express"
import passport from 'passport'
import { passportError, authorization } from "../utils/errorMessages.js"
import { generateToken } from "../utils/jwt.js"

const sessionRouter = Router()

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
        const token = generateToken(req.user)
        res.cookie('jwtCookie', token, {
            maxAge: 43200000,
        })
        res.redirect(`/static/products?info=${req.user.first_name}`) //Redirect
        //res.status(200).send({ payload: req.user })
    } catch (error) {
        res.status(500).send({ message: `Failed to login: ${error}` })
    }
})

sessionRouter.get('/testJWT', passport.authenticate('jwt', {session: true}), async (req, res) => {
    res.status(200).send({message: req.user})
    //console.log(req.user.user);
    req.session.user = {
        first_name: req.user.user.first_name,
        last_name: req.user.user.last_name,
        age: req.user.user.age,
        email: req.user.user.email
    }
})

sessionRouter.get('/current', passportError('jwt'), authorization('user'), (req, res) => {
    res.send(req.user)
})

sessionRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => {
    res.status(200).send({ payload: req.user })
})

sessionRouter.get('/githubSession', passport.authenticate('github'), async (req, res) => {
    req.session.user = req.user
    res.status(200).send({ message: 'Session created' })
})

sessionRouter.get('/logout', async (req, res) => {
    if (req.session) {
        req.session.destroy()
    }
    res.clearCookie('jwtCookie')
    res.redirect(`/static/login`) //Redirect
})

export default sessionRouter