import { Router } from "express"
import passport from 'passport'
import { passportError, authorization } from "../utils/errorMessages.js"
import { current, github, githubSession, login, logout, testJWT } from "../controllers/sessions.controller.js"

const sessionRouter = Router()

sessionRouter.post('/login', passport.authenticate('login'), login)

sessionRouter.get('/testJWT', passport.authenticate('jwt', {session: true}), testJWT)

sessionRouter.get('/current', passportError('jwt'), authorization('user'), current)

sessionRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), github)

sessionRouter.get('/githubSession', passport.authenticate('github'), githubSession)

sessionRouter.get('/logout', logout)

export default sessionRouter