import { Router } from "express"
import passport from "passport"
import * as userController from "../controllers/users.controller.js"
import CustomError from "../services/Errors/CustomError.js"
import { EErrors } from "../services/errors/enums.js"
import { generateUserErrorInfo } from "../services/errors/info.js"

const userRouter = Router() 

//Signin new user
userRouter.post('/signin', (req, res, next) => {
    const { first_name, last_name, email } = req.body
    try {
        if (!last_name || !first_name || !email) {
            CustomError.createError({
                name: 'Error creating user',
                cause: generateUserErrorInfo({ first_name, last_name, email }),
                message: 'All fields must be completed',
                code: EErrors.USER_ERROR
            })
        }
        next()
    } catch (error) {
        next(error)
    }
}, passport.authenticate('register'), userController.postUser)

export default userRouter