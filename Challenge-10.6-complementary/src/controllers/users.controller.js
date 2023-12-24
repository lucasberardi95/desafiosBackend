import { logger } from "../utils/logger.js"
import { userModel } from "../models/users.models.js"
import cartModel from "../models/carts.models.js"

export const postUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).send({ message: 'Existing user' })
        }
        res.redirect(`/static/login`) //Redirect
    } catch (error) {
        logger.error(`[ERROR] - Date: ${new Date().toLocaleTimeString()} - ${error.message}`)
        res.status(500).send({ message: `Error creating user: ${error}` })
    }
}

export const deleteUser = async (req, res) => {
    const {id} = req.params
    try {
        const user = await userModel.findOneAndDelete({_id: id})
        if (!user) {
            return res.status(404).send('User id not found')
        } 
        //Deleting his/her cart
        const cartId = user.cart
        if (cartId) {
            await cartModel.findByIdAndDelete(cartId)
            logger.info('Associated cart successfully deleted')
        }
        return res.status(200).send('User deleted succesfully')
    } catch (error) {
        logger.error(`[ERROR] - Date: ${new Date().toLocaleTimeString()} - ${error.message}`)
        res.status(500).send({ message: `Error deleting user: ${error}` })
    }
}