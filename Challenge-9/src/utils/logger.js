import winston from 'winston'

export const logger = winston.createLogger({
    levels: {
        fatal: 0,
        error: 1,
        warn: 2,
        info: 3,
        debug: 4
    },
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console({ level: 'info'}),
        new winston.transports.File({ filename: './src/logs/errors.log', level: 'warn' })
    ]
})

export const addLogger = (req, res, next) => {
    req.logger = logger,
    req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`)
    next()
}