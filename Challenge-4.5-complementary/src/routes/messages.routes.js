import { Router } from "express"
import messageModel from "../models/messages.models.js"

const messageRouter = Router()

messageRouter.get('/', async (req, res)=>{
    try {
        const messages = await messageModel.find()
        res.status(200).send({result: "OK", messages})
    } catch (error) {
        res.status(400).send({error: `Error getting messages ${error}`})
    }
})

messageRouter.post('/', async (req, res)=>{
    const {email, message} = req.body
    try {
        const response = await messageModel.create({
            email,
            message
        })
        res.status(200).send({result: "OK", response})
    } catch (error) {
        res.status(400).send({error: `Error sending message ${error}`})
    }
})

export default messageRouter