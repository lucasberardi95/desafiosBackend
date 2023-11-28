import { Router } from "express"
import passport from "passport"
import * as userController from "../controllers/users.controller.js"
import CustomError from "../services/Errors/CustomError.js"
import { EErrors } from "../services/errors/enums.js"
import { generateUserErrorInfo } from "../services/errors/info.js"
import { sendRecoveryEmail } from "../config/nodemailer.js"
import crypto from 'crypto'
import { logger } from "../utils/logger.js"
import { createHash, validatePassword } from "../utils/bcrypt.js"


const userRouter = Router()
const recoveryLinks = {}

//Signin new user
userRouter.post('/signin', (req, res, next) => {
    const { first_name, last_name, email, password, age } = req.body
    try {
        if (!last_name || !first_name || !email || !password || !age) {
            CustomError.createError({
                name: 'Error creating user',
                cause: generateUserErrorInfo({ first_name, last_name, email, password, age }),
                message: 'All fields must be completed',
                code: EErrors.USER_ERROR
            })
        }
        next()
    } catch (error) {
        next(error)
    }
}, passport.authenticate('register'), userController.postUser)

userRouter.post('/password-recovery', (req, res) => {
    const { email } = req.body
    try {
        //User verification
        const token = crypto.randomBytes(20).toString('hex')

        recoveryLinks[token] = { email, timestamp: Date.now() }

        const recoveryLink = `http://localhost:4000/api/users/reset-password/${token}`

        sendRecoveryEmail(email, recoveryLink)

        res.status(200).send('Recovery email sent successfully')
    } catch (error) {
        logger.error(`[ERROR] - Date: ${new Date().toLocaleTimeString()} - ${error.message}`)
        res.status(500).send('Error sending Recovery email', error)
    }
})

userRouter.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params
    const { newPassword } = req.body
    try {
        //Token verification & expiration(1hr)
        const linkData = recoveryLinks[token]
        if (!linkData || Date.now() - linkData.timestamp > 3600000) {
            logger.error(`[ERROR] - Date: ${new Date().toLocaleTimeString()} - Expired or invalid token: ${token}`);
            return res.status(400).send('Invalid or expired token. Try again');
        }

        const { email } = linkData;
        const user = await UserModel.findOne({ email });

        if (!user) {
            logger.error(`User not found: ${email}`);
            return res.status(400).send({ error: `User not found: ${email}` });
        }

        // Check if new password is the same as the old password
        const isSamePassword = validatePassword(newPassword, user.password);
        if (isSamePassword) {
            logger.error(`The new password cannot be the same as the current password`);
            return res.status(400).send({ error: `The new password cannot be the same as the current password` });
        }

        // Update user's password in the database
        user.password = createHash(newPassword)
        await user.save();

        // Delete the recovery token
        delete recoveryLinks[token]

        logger.info(`[INFO] - Date: ${new Date().toLocaleTimeString()} - Password updated successfully for user: ${email}`);
        res.status(200).send('Password changed successfully')
    } catch (error) {
        logger.error(`[ERROR] - Date: ${new Date().toLocaleTimeString()} - ${error.message}`)
        res.status(500).send(`Error changing password: ${error}`)
    }
})

export default userRouter