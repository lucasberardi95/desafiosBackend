import { Router } from "express"
import passport from 'passport'
import { passportError, authorization } from "../utils/errorMessages.js"
import * as sessionController from "../controllers/sessions.controller.js"

const sessionRouter = Router()

sessionRouter.post('/login', passport.authenticate('login'), sessionController.login)

sessionRouter.get('/testJWT', passport.authenticate('jwt', {session: true}), sessionController.testJWT)

sessionRouter.get('/current', passportError('jwt'), authorization('user'), current)

sessionRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), sessionController.github)

sessionRouter.get('/githubSession', passport.authenticate('github'), sessionController.githubSession)

sessionRouter.get('/logout', sessionController.logout)

export default sessionRouter