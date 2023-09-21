import { Router } from "express";
import { userModel } from "../models/users.models.js";

const userRouter = Router()

userRouter.post('/signin', async (req, res)=>{
    const {first_name, last_name, email, password, age} = req.body
    let role = 'user'
    try {
        if (email == 'adminCoder@coder.com' && password == '1234' ) {
            console.log('You are admin')
            role = 'admin'
        }
        const user = await userModel.create({first_name, last_name, email, password, age, role})
        //res.status(200).send({ result: 'Registered user', message: response})
        res.redirect(`/static/products?info=${user.first_name}`) //Redirect
    } catch (error) {
        res.status(400).send({ error: `Error creating user ${error}`})
    }
})

export default userRouter