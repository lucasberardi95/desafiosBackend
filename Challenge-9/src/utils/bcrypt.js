//Evito tener que generar yo el tema de lo que es la encriptacion y desencriptacion y la mando a un modulo externo
import bcrypt from 'bcrypt'
/* import 'dotenv/config' */
//Encripto password
export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(parseInt(process.env.SALT)))

/* const hashPassword = createHash('keny')
console.log(hashPassword) */

//Valido password
export const validatePassword = (passwordSend, passwordDB) => bcrypt.compareSync(passwordSend, passwordDB)

/* console.log(validatePassword('keny', hashPassword)) */