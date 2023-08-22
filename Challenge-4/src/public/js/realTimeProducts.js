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

    