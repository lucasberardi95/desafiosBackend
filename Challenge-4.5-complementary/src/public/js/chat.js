const socket = io()

const buttonChat = document.getElementById('buttonChat')
const paragraphMessages = document.getElementById('paragraphMessages')
const inputValues = document.getElementById('chatBox')
let user

Swal.fire({
    title: 'User id',
    text: 'Please enter your username',
    input: 'text',
    inputValidator: (value)=>{
        return !value && 'Enter a valid username'
    },
    allowOutsideClick: false
}).then(result =>{
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