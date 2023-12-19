import swaggerJSDoc from 'swagger-jsdoc'
import { __dirname } from '../path.js'


//Swagger config
const swaggerOptions = {
    definition: {
        openapi: '3.1.0',
        info: {
            title: 'Ecommerce Docs',
            description: 'API ecommerce'
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}

export const specs = swaggerJSDoc(swaggerOptions)