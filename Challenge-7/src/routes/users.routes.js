import { Router } from "express"
import passport from "passport"
import * as userController from "../controllers/users.controller.js"
const userRouter = Router()

userRouter.post('/signin', passport.authenticate('register'), userController.postUser)

export default userRouter