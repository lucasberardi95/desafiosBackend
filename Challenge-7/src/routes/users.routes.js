import { Router } from "express"
import passport from "passport"
import { postUser } from "../controllers/users.controller.js"
const userRouter = Router()

userRouter.post('/signin', passport.authenticate('register'), postUser)

export default userRouter