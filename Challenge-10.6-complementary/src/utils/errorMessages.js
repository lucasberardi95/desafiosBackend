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

// I put a role and verify if my user fulfills it
export const authorization = (allowedRoles) => {
    return async (req, res, next) => {
        console.log(req.user)
        // The token is queried again because it may expire, the user may delete the history or whatever
        if (!req.user) {
            return res.status(401).send({ error: 'Unauthorized user' })
        }

        const userRole = req.user.user.role

        // Check if the user's role is included in the list of allowed roles
        if (allowedRoles.includes(userRole)) {
            next() // Allow to continue with the next middleware or the route
        } else {
            res.status(403).send({ error: 'Forbidden', message: 'Unauthorized access' })
        }
    }
}
