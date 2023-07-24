class ProductManager {
    constructor() {
        this.products = []
    }
    //Metodo para agregar productos al array vacio
    addProduct(title, description, price, thumbnail, code, stock) {
        if(this.products.some((product)=> product.code === code)) {
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
    getProducts() {
        console.log(this.products)
    }
    getProdcutById(id) {
        const product = this.products.find((product) => product.id === id)
        if (product) {
            console.log(product)
        } else {
            console.error('Not found');
        }
        
    }
}

const manager = new ProductManager()

manager.getProducts()
manager.addProduct('Producto prueba', 'Este es un producto prueba', 200, 'Sin imagen', 'abc123', 25)
manager.getProducts()
manager.addProduct('Producto prueba', 'Este es un producto prueba', 200, 'Sin imagen', 'abc123', 25)
manager.getProducts()
manager.addProduct('Producto prueba', 'Este es un producto prueba', 200, 'Sin imagen', 'abc123', 25)