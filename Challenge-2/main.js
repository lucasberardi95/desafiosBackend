import { promises as fs } from 'fs'

class ProductManager {
    constructor() {
        this.path = './products.txt'
    }
    //Method to add products
    addProduct = async (product) => {
        const products = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        if (products.some(prod => prod.code === product.code)) {
            console.log('Product already loaded')
        } else {
            products.push(product)
            await fs.writeFile(this.path, JSON.stringify(products))
        }
    }

    //Method to return products
    getProducts = async () => {
        const products = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        console.log(products)
    }

    //Method to return products by Id
    getProductById = async (id) => {
        const products = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        const prod = products.find(product => product.id === id)
        if (prod) {
            console.log(prod)
        } else {
            console.log('Id Product not found')
        }
    }

    //Method to update products
    updateProduct = async (id, { title, description, price, thumbnail, code, stock }) => {
        const products = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        const indice = products.findIndex(prod => prod.id === id)

        if (indice != -1) {
            products[indice] = {
                ...products[indice],
                title: title,
                description: description,
                price: price,
                thumbnail: thumbnail,
                code: code,
                stock: stock
            }
            await fs.writeFile(this.path, JSON.stringify(products))
        } else {
            console.log('Id Product not found')
        }
    }

    //Method to delete products
    deleteProduct = async (id) => {
        const products = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        const prods = products.filter(prod => prod.id != id)
        await fs.writeFile(this.path, JSON.stringify(prods))
    }
}

class Product {
    constructor(title, description, price, thumbnail, code, stock) {
        this.title = title
        this.description = description
        this.price = price
        this.thumbnail = thumbnail
        this.code = code
        this.stock = stock
        this.id = Product.incrementID()
    }
    static incrementID() {
        this.idIncrement = this.idIncrement ? this.idIncrement + 1 : 1
        return this.idIncrement
    }
}

const manager = new ProductManager()
const product1 = new Product('Test Product', 'This is a test product', 200, 'Without image', 'abc123', 25)
const product2 = new Product('Test Product', 'This is a test product', 200, 'Without image', 'abc1234', 25)

//manager.addProduct(product1)
//manager.addProduct(product2)
//manager.getProducts()
//manager.getProductById(1)
//manager.updateProduct(1, { title: 'Rice', description: 'Rich', price: 1200, thumbnail: 'Image1', code: '1234', stock: 99 })
//manager.deleteProduct(1)