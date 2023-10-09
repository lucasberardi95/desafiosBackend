import 'dotenv/config'
import jwt from "jsonwebtoken"

export const generateToken = (user) => {
    /* Parameters:
    1 - Object associated with token
    2 - Key for encryption
    3 - ttl 
    */
    const token = jwt.sign({ user }, "1234", { expiresIn: '12h' })
    return token
}

console.log(generateToken({"_id":"6515036a799664f8d35dbefa","first_name":"lucas","last_name":"lucas","email":"lucas@lucas.com","password":"$2b$15$waUn9Jt.CKQF3l/D3CPtw.e4q6YDKy97A5UtuRQ2tSjP8GwPBAo1q","role":"user","age":{"$numberInt":"1234"}}))

export const authToken = (req, res, next) => {
    //Consult header
    const authHeader = req.headers.Authorization //Check if token exists
    if (!authHeader) {
        return res.status(401).send({ error: 'Unauthenticated user' })
    }
    const token = authHeader.split(' ')[1]//Split token into 2 and keep the valid part

    jwt.sign(token, process.env.JWT_SECRET, (error, credentials) => {
        if (error) {
            return res.status(403).send({ error: 'Unauthorized user' })
        }
        //Decrypt token
        req.user = credentials.user
        next()
    })
}

