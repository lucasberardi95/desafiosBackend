import { Router } from "express";
import { userModel } from "../models/users.models.js";

const userRouter = Router()

userRouter.post('/signin', async (req, res)=>{
    const {first_name, last_name, email, password, age} = req.body
    try {
        const user = await userModel.create({first_name, last_name, email, password, age})
        //res.status(200).send({ result: 'Registered user', message: response})
        res.redirect(`/static/products?info=${user.first_name}`)
    } catch (error) {
        res.status(400).send({ error: `Error creating user ${error}`})
    }
})

export default userRouter