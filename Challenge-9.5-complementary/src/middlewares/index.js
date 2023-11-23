import { EErrors } from "../services/errors/enums.js"

export default (error, req, res, next) => {
    console.log(error.cause)
    switch (error.code) {
        case EErrors.PRODUCT_ERROR:
        res.send({ status: "error", error: error.name })
            break
        case EErrors.USER_ERROR:
            res.send({ status: USER_ERROR, error: error.name })
            break
        default:
            res.send({ status: "error", error: "Unhandled error" })
    }
}