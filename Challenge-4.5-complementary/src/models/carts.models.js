import { Schema, model } from "mongoose";

const cartSchema = new Schema({
    products: [{
        id_prod: {
            type: Schema.Types.ObjectId, // id autogenerado de mongo
            ref: 'products',
            required: true
        },
    quantity: {
        type: Number,
        required: true // default: 1
    }
    }]
})

export const cartModel = model('carts', cartSchema)