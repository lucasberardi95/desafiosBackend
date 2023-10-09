import passport from "passport"

//General function to return error in passport strategies
//First filter for any passport strategy
export const passportError = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, (error, user, info) => {
            if (error) {
                return next(error)
            }
            if (!user) {
                return res.status(401).send({error: info.messages ? info.messages : info.toString()})
            }
            req.user = user
            next()
        }) (req, res, next)
    }
}

//I put a role and verify if my user fulfill it
export const authorization = (role) => {
    return async (req, res, next) => {
        console.log(req.user)
        //The token is queried again because it may expire, the user may delete the history or whatever
        if (!req.user) {
            return res.status(401).send({error: 'Unauthorized user'})
        }
        if (req.user.user.role != role) {
            return res.status(403).send({error: `The user doesn't have the necessary privileges`})
        }
        next()
    }
}