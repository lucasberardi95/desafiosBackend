import { Schema, model } from "mongoose"
import paginate from "mongoose-paginate-v2"

const orderSchema = new Schema({
    name: String,
    size: {
        type: String,
        enum: ['small', 'medium', 'large'],//enum: va a definir un tipo de dato el cual no puede ser mas que valores aqui presente
        default: 'medium'
    },
    price: Number,
    quantity: Number,
    Date: {
        type: Date,
        default: Date.now
    }
})

orderSchema.plugin(paginate)

export const orderModel = model('order', orderSchema)