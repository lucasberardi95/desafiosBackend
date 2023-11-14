import winston from 'winston'

export const logger = winston.createLogger({
    levels: {
        fatal: 0,
        error: 1,
        warn: 2,
        info: 3,
        debug: 4
    },
    transports: [
        new winston.transports.Console({ 
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize({
                        fatal: 'red',
                        error: 'orange',
                        warn: 'yellow',
                        info: 'blue',
                        debug: 'white'
                    }),
                    winston.format.simple()
            )
        }),
        new winston.transports.File({ filename: './errors.log', level: 'warn' })
    ]
})

export const addLogger = (req, res, next) => {
    req.logger = logger,
    req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString}`)
    next()
}