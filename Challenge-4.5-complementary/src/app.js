import express  from "express";
import productRouter from "./routes/products.routes.js";
import cartRouter from "./routes/carts.routes.js";
import mongoose from "mongoose";

const app = express()
const PORT = 4000

mongoose.connect('mongodb+srv://lucasberardi17:lucas1234@cluster0.rjyqxv4.mongodb.net/?retryWrites=true&w=majority')
.then(()=> console.log('DB connected'))
.catch((error)=> console.log(`Error connecting to MongoDB Atlas: ${error}`))

app.use(express.json())

app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)

app.listen(PORT, ()=>{
    console.log(`Server on port ${PORT}`);
})