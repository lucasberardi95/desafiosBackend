import { logger } from "../utils/logger.js"

export const getLogs = async (req, res) => {
    //logger.silly('This is a silly log'),
    logger.debug('This is a debug log'),
    //logger.verbose('This is a verbose log'),
    //logger.http('This is a http log'),
    logger.info('This is a info log'),
    logger.warn('This is a warn log'),
    logger.error('This is a error log'),
    logger.fatal('This is a fatal log')
    res.send('Logs added')
}