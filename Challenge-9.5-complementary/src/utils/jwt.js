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

//console.log(generateToken({"_id":"650c73104ca5bbf04286eaae","first_name":"Coder","last_name":"House","email":"adminCoder@coder.com","password":"1234","role":"admin","age":{"$numberInt":"1234"}}))
//console.log(generateToken({"_id":"6540ba62e853dbaafc64afc5","first_name":"lucas","last_name":"lucas","email":"lucas@lucas.com","password":"$2b$15$0Ugp/.xR4oiiwlzkZ4UH4.Rorta62ulrZejbD.4xBxQ5.vrZl8UcS","role":"user","age":{"$numberInt":"1234"},"cart":{"$oid":"6540b6926211fdfd64943b5a"}}))

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

