import { promises as fs } from 'fs'

export class ProductManager {
    constructor(path) {
        this.products = []
        this.path = path
    }
    static incrementId(products) {
		const ids = []
		let newId = 1
		products.forEach(product => ids.push(product.id))
		products.length > 0 && (newId = Math.max(...ids) + 1)
		return newId
	}
    //Method to return products
    async getProducts() {
        const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        return prods
    }
    //Method to return products by Id
    async getProductById(id) {
        const products = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        const prod = products.find(product => product.id === id)
        if (prod) {
            return prod
        } else {
            console.log('Id Product not found')
        }
    }
    //Method to add products
    async addProduct(product) {
        const products = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        if (products.some(prod => prod.code === product.code)) {
            return false
        } else {
            product.id = ProductManager.incrementId(products)
            products.push(product)
            await fs.writeFile(this.path, JSON.stringify(products))
            return true
        }
    }
    //Method to update products
    async updateProducts(id, updatedFields) {
        const products = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        const indice = products.findIndex(prod => prod.id === id)

        if (indice != -1) {
            let updatedProduct = { ...products[indice], ...updatedFields };
            products[indice] = updatedProduct;
            await fs.writeFile(this.path, JSON.stringify(products))
            return true
        } else {
            console.log('Id Product not found')
            return false
        }
    }
    //Method to delete products
    async deleteProduct(id) {
        const products = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        const updatedProducts = products.filter(product => product.id !== id)
        if (products.length === updatedProducts.length) {
            return false
        }
        await fs.writeFile(this.path, JSON.stringify(updatedProducts))
        return true
    }    
}


/* class Product {
    constructor(title, description, code, price, status, stock, thumbnail, category) {
        this.title = title
        this.description = description
        this.code = code
        this.price = price
        this.status = status
        this.stock = stock
        this.category = category
        this.thumbnail = thumbnail
        this.id = Product.incrementID()
    }
    static incrementID() {
        this.idIncrement = this.idIncrement ? this.idIncrement + 1 : 1
        return this.idIncrement
    }
}

const manager = new ProductManager('./src/models/products.json')
const product1 = new Product('Test Product', 'This is a test product', 'abc1', 200, true, 100, 'Without image', 'Category1')
const product2 = new Product('Test Product', 'This is a test product', 'abc2', 200, true, 100, 'Without image', 'Category1')
const product3 = new Product('Test Product', 'This is a test product', 'abc3', 200, true, 100, 'Without image', 'Category1')

const methods = async () => {
    //await manager.addProduct(product1)
    //await manager.getProducts()
    //await manager.getProductById(1)
    //await manager.updateProduct(1, { title: 'Rice', description: 'Rich', code: '1234', price: 1200, status: true, stock: 99, category: 'Category11', thumbnail: 'Image1' })
    //await manager.deleteProduct(1)
}

methods()
 */