import express from 'express'
import multer from 'multer'
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'
import { __dirname } from './path.js'
import path from 'path'
import routerProd from './routes/products.routes.js'
import routerCart from './routes/cart.routes.js'
import { ProductManager } from './controllers/productManager.js'

const PORT = 4000
const app = express()
const productManager = new ProductManager(path.resolve(__dirname, './models/products.json'))

//Server
const server = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})
const io = new Server(server)

//Config

const storage = multer.diskStorage({
    destination: (req, file, cb) => { //cb => callback
        cb(null, 'src/public/img') //el null hace referencia a que no envie errores
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${file.originalname}`) //concateno la fecha actual en ms con el nombre del archivo
        //1232312414heladera-samsung-sv
    }
})

//Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const upload = multer({ storage: storage })
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.resolve(__dirname, 'views'))

//Declaro constanto para poder obtener los productos y enviarlos luego a index.handlebars para actualizar la lista
const sendUpdatedProductList = async () => {
    const products = await productManager.getProducts()
    io.emit('productListUpdated', products)
}

//Conexion de Socket.io
io.on('connection', (socket)=>{
    console.log('Socket.io connection')
    //Recibo el producto y lo agrego a products.json con el metodo addProduct
    socket.on('newProduct', async (product)=>{
        console.log(product)
        const success = await productManager.addProduct(product)
        if(success){
        socket.emit('productCreated', 'Product created successfully' )
        sendUpdatedProductList()
        } else{
        socket.emit('productCreationError', 'Product code already exists')
        }
    })
})

//Routes
app.use('/static', express.static(path.join(__dirname, '/public')))
app.use('/api/product', routerProd)
app.use('/api/carts', routerCart)

/* app.post('/upload', upload.single('product'), (req, res) => {
    console.log(req.file)
    console.log(req.body)
    res.status(200).send("Imagen cargada")
}) */

//HBS
app.get('/static', (req, res) =>{
    res.render('realTimeProducts', {
        rutaCSS: 'realTimeProducts.css',
        rutaJS: 'realTimeProducts.js',
    })
})
app.get('/index', (req, res) =>{
    res.render('index', {
        rutaJS: 'index.js'
    })
})