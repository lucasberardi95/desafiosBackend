import { Schema, model } from "mongoose"
import paginate from "mongoose-paginate-v2"

const cartSchema = new Schema({
    products: {
        type: [
            {
                id_prod: {
                    type: Schema.Types.ObjectId, // id autogenerado de mongo
                    ref: 'products',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true // default: 1
                }
            }
        ],
        default: function () {
            return []
        }
    }
})

cartSchema.pre('find', function(){
    this.populate('products.id_prod')
})

cartSchema.plugin(paginate)

const cartModel = model('carts', cartSchema)
export default cartModel