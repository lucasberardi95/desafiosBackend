import { Router } from "express"
import productRouter from "./products.routes.js"
import cartRouter from "./carts.routes.js"
import messageRouter from "./messages.routes.js"
import routerMock from "./mocking.routes.js"
import userRouter from './users.routes.js'
import sessionRouter from './sessions.routes.js'
import viewRouter from "./views.routes.js"

const router = Router()

router.use('/api/products', productRouter)
router.use('/api/carts', cartRouter)
router.use('/api/messages', messageRouter)
router.use('/api/mockingproducts', routerMock)
router.use('/api/users', userRouter)
router.use('/api/sessions', sessionRouter)
router.use('/', viewRouter)

export default router