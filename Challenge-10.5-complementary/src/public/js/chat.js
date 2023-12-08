const socket = io()

const buttonChat = document.getElementById('buttonChat')
const paragraphMessages = document.getElementById('paragraphMessages')
const inputValues = document.getElementById('chatBox')
let user

Swal.fire({
    title: 'User email',
    text: 'Please enter your email',
    input: 'text',
    inputValidator: (value) => {
        if (!value) {
            return 'Enter a valid email'
        }
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
        if (!emailRegex.test(value)) {
            return 'Enter a valid email'
        }
    },
    allowOutsideClick: false
}).then((result) => {
    user = result.value
    console.log(user)
})

buttonChat.addEventListener('click', ()=>{
    let currentDate = new Date().toLocaleString()
    if(inputValues.value.trim().length > 0){ //Evito que me envien msjs vacios
        socket.emit('message', {date: currentDate, user:user, message: inputValues.value})
        inputValues.value = '' //Limpio el input
    }
})

socket.on('messages', messagesArray =>{
    paragraphMessages.innerHTML = '' //Limpio el html
    messagesArray.forEach(message => {
        paragraphMessages.innerHTML += `<p> ${message.date} : ${message.user} sent ${message.message} </p>`
    })

})