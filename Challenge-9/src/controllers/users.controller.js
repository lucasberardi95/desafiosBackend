import { logger } from "../utils/logger.js"

export const postUser = async (req, res)=>{
    try {
        if(!req.user){
        return res.status(400).send({message: 'Existing user'})
        }
        res.redirect(`/static/login`) //Redirect
    } catch (error) {
        logger.error(`[ERROR] - Date: ${new Date().toLocaleTimeString()} - ${error.message}`)
        res.status(500).send({message: `Error creating user: ${error}`})
    }
}