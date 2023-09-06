import express from "express"
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'
import { __dirname } from './path.js'
import path from 'path'
import mongoose from "mongoose"
import productRouter from "./routes/products.routes.js"
import cartRouter from "./routes/carts.routes.js"
import messageRouter from "./routes/messages.routes.js"

const app = express()
const PORT = 4000

//MongoDB Atlas connection
mongoose.connect('mongodb+srv://lucasberardi17:lucas1234@cluster0.rjyqxv4.mongodb.net/?retryWrites=true&w=majority')
.then(()=> console.log('DB connected'))
.catch((error)=> console.log(`Error connecting to MongoDB Atlas: ${error}`))

//Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Routes
app.use('/static', express.static(path.join(__dirname, '/public')))
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/', messageRouter)

//HBS configuration
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.resolve(__dirname, 'views'))


app.listen(PORT, ()=>{
    console.log(`Server on port ${PORT}`)
})