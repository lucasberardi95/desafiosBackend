import local from 'passport-local' //Strategy 
import passport from 'passport' //Strategy manager
import GithubStrategy from 'passport-github2'
import jwt from 'passport-jwt'
import { createHash, validatePassword } from '../utils/bcrypt.js'
import { userModel } from '../models/users.models.js'
import { logger } from '../utils/logger.js'

//Define strategy to use
const localStrategy = local.Strategy
const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt //Query header extractor

const initializePassport = () => {

    const cookieExtractor = req => {
        console.log(req.cookies)
        //If i get {} means there is No cookies != my cookie doesn't exists
        //If cookies exist, check for my cookie and if not, assign {}
        const token = req.cookies ? req.cookies.jwtCookie : {}
        return token
    }
    //JTW
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]), //Query token from cookies
        secretOrKey: process.env.JWT_SECRET
    }, async (jwt_payload, done) => {
        try {
            console.log(jwt_payload);
            return done(null, jwt_payload) //Return token content
        } catch (error) {
            logger.error(`[ERROR] - Date: ${new Date().toLocaleTimeString()} - ${error.message}`)
            return done(error)
        }
    }))

    //PASSPORT REGISTER(SIGNIN)
    passport.use('register', new localStrategy(
        //done es como un res.status(), callback de respuesta
        { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
            //Defino como voy a registrar un usuario
            const { first_name, last_name, email, age } = req.body
            try {
                const user = await userModel.findOne({ email: email })
                if (user) {
                    //done es como si fuera un return de un callback
                    return done(null, false,)
                }
                const passwordHash = createHash(password)
                const userCreated = await userModel.create({
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                    age: age,
                    password: passwordHash
                })
                logger.info(userCreated)
                return done(null, userCreated)
            } catch (error) {
                logger.error(`[ERROR] - Date: ${new Date().toLocaleTimeString()} - ${error.message}`)
                return done(error)
            }
        }
    ))
    //PASSPORT GITHUB
    passport.use('github', new GithubStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(accessToken)
            console.log(refreshToken)
            const user = await userModel.findOne({ email: profile._json.email })
            if (!user) {
                const userCreated = await userModel.create({
                    first_name: profile._json.name,
                    last_name: ' ',
                    email: profile._json.email,
                    age: 18, //Default age
                    password: 'password'
                })
                done(null, userCreated)
            } else {
                done(null, user)

            }
        } catch (error) {
            logger.error(`[ERROR] - Date: ${new Date().toLocaleTimeString()} - ${error.message}`)
            done(error)
        }
    }))
    //PASSPORT LOGIN
    passport.use('login', new localStrategy({ usernameField: 'email' }, async (username, password, done) => {
        try {
            const user = await userModel.findOne({ email: username })
            if (!user) {
                done(null, false, { message: 'User not found' })//Usuario no encontrado
            }
            if (validatePassword(password, user.password)) {
                return done(null, user)//Usuario y contrasena validos
            }
            //Else -> Contrasena no validas
            return done(null, false, { message: 'Invalid password' })//Contrasena invalida
        } catch (error) {
            logger.error(`[ERROR] - Date: ${new Date().toLocaleTimeString()} - ${error.message}`)
            return done(error)
        }
    }))
    //Inicializar sesion del usuario
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    //Eliminar sesion del usuario
    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id)
        done(null, user)
    })
}

export default initializePassport