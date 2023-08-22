import { promises as fs } from 'fs'

export class CartManager {
    constructor(path) {
        this.path = path
        this.products = []
    }
    static incrementId(carts) {
		const ids = []
		let newId = 1
		carts.forEach(cart => ids.push(cart.id))
		carts.length > 0 && (newId = Math.max(...ids) + 1)
		return newId
	}
    //Method to create a cart
    async createCart(cart) {
        const carts = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        if (carts.find(existingCart => existingCart.id === cart.id)) {
            return false
        } else {
            cart.id = CartManager.incrementId(carts)
            cart.products = []
            carts.push(cart)
            await fs.writeFile(this.path, JSON.stringify(carts))
            return true
        }
    }
    //Method to return products by cartId
    async getCartById(id) {
        const carts = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        const cart = carts.find(cart => cart.id === id)
        if (cart) {
            return cart
        } else {
            console.log('Id Cart not found')
        }
    }
    //Method to add product to cart
    async addProductToCart(cid, pid) {
        const carts = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        const cart = carts.find(cart => cart.id === cid)
		const products = JSON.parse(await fs.readFile('./src/models/products.json', 'utf-8'))
		const product = products.find(prod => prod.id === pid)

        if (!product) {
			return false
		} else if (cart) {
			const existingProduct = cart.products.find(prod => prod.id === pid)
			if(existingProduct){
                existingProduct.quantity++
            } else{
                cart.products.push({ id: product.id, quantity: 1 })
            }
			const writeCarts = JSON.stringify(carts)
			await fs.writeFile(this.path, writeCarts)
			return true
		} else {
			return false
		}
	}
    //Method to delete cart
    async deleteCart(id) {
        const carts = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        const updatedCarts = carts.filter(cart => cart.id != id)
        if (carts.length === updatedCarts.length) {
            return false
        } else{
            await fs.writeFile(this.path, JSON.stringify(updatedCarts))
            return true
        }
    }    
}

