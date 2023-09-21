const buttonLogOut = document.getElementById('buttonLogOut')

buttonLogOut.addEventListener('click', ()=>{
    // Redirigir al usuario a la vista que corresponda, en este caso a login
    window.location.href = '/static/login' 
})