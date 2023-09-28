import { Router } from "express";
import { userModel } from "../models/users.models.js";
import { createHash } from "../utils/bcrypt.js";
import passport from "passport"
const userRouter = Router()

/* 
const {first_name, last_name, email, password, age} = req.body
    let role = 'user'
    try {
        const hashPassword = createHash(password)
        if (email == 'adminCoder@coder.com' && password == '1234' ) {
            console.log('You are admin')
            role = 'admin'
        }
        const user = await userModel.create({
            first_name: first_name,
            last_name: last_name,
            email: email, 
            password: hashPassword, 
            age: age, 
            role: role
        })
        //res.status(200).send({ result: 'Registered user', message: response})
        res.redirect(`/static/products?info=${user.first_name}`) //Redirect
    } catch (error) {
        res.status(400).send({ error: `Error creating user ${error}`})
    }
*/
userRouter.post('/signin', passport.authenticate('register'), async (req, res)=>{
    try {
        if(!req.user){
        return res.status(400).send({message: 'Existing user'})
        }
        res.redirect(`/static/products?info=${req.user.first_name}`) //Redirect
        //res.status(200).send({message: 'Created user'})
    } catch (error) {
        res.status(500).send({message: `Error creating user: ${error}`})
    }
})

export default userRouter