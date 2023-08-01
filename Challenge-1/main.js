class ProductManager {
    constructor() {
        this.products = []
    }
    //Method to add products to the empty array
    addProduct(title, description, price, thumbnail, code, stock) {
        //Validate that all fields are required
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.error('All fields are required');
        //Validate that the code is not repeated
        } else if(this.products.some((product)=> product.code === code)) {
            console.error('Product code already loaded');
        } else {
            this.products.push({
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
                id: this.products.length+1
            })
        }
    }
    //Method to return products
    getProducts() {
        console.log(this.products)
    }
    //Method to return product by Id
    getProdcutById(id) {
        const product = this.products.find((product) => product.id === id)
        if (product) {
            console.log(product)
        } else {
            console.error('Not found')
        }
        
    }
}

const manager = new ProductManager()

manager.getProducts()
manager.addProduct('Test Product', 'This is a test product', 200, 'Without image', 'abc123', 25)
manager.getProducts()
manager.addProduct('Test Product', 'This is a test product', 200, 'Without image', 'abc123', 25)
manager.getProducts()
manager.addProduct('Test Product', 'This is a test product', 200, 'Without image', 'abc123', 25)

manager.getProdcutById(1)