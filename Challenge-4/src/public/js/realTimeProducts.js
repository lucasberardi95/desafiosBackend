const socket = io()

const form = document.getElementById('formProduct')

form.addEventListener('submit', (e)=>{
    e.preventDefault()
    const datForm = new FormData(e.target)//El Form dispara el evento
    const prod = Object.fromEntries(datForm)//Recibe un objeto iterable, lo transforma y me retorna un objeto simple
    socket.emit('newProduct', prod)
    socket.on('productCreated', (message)=>{
        Swal.fire({
            icon: 'success',
            text: message
        })
    })
    e.target.reset()
})

    // Escuchar el evento de actualización de la lista de productos
    socket.on('productListUpdated', (products) => {
        const productList = document.querySelector('#realTimeProducts')
        productList.innerHTML = ''

        products.forEach((product) => {
            const li = document.createElement('li')
            li.textContent = `  title: ${product.title} - 
                                desccription: ${product.description} -
                                code: ${product.code} -
                                price: ${product.price} -
                                status: ${product.status} -
                                stock: ${product.stock} -
                                category: ${product.category}
                            `
            productList.appendChild(li)
        })
    })