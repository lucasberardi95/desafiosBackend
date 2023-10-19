import productModel from "../models/products.models.js"

export const getProducts = async (req, res) => {
    let { limit, page, category, status, sort } = req.query
    limit = limit ? parseInt(limit) : 10
    page = page ? parseInt(page) : 1
    let sortOption
    sort === 'asc' && (sortOption = 'price')
    sort === 'desc' && (sortOption = '-price')
    try {
        const options = {
            limit: limit,
            page: page,
            sort: sortOption || null
        }
        const query = {
            ...(category ? { category } : {}),
            ...(status ? { status } : {}),
        }
        const prods = await productModel.paginate(query, options)
        if (prods) {
            return res.status(200).send(prods)
        } else {
            res.status(404).send({ error: "Products not found" })
        }
    } catch (error) {
        res.status(500).send({ error: `Error displaying products:  ${error}` })
    }
}

export const getProduct = async (req, res) => {
    const { id } = req.params
    try {
        const prod = await productModel.findById(id)
        if (prod) {
            return res.status(200).send({ result: 'OK', message: prod })
        } else {
            res.status(404).send({ result: 'Product id not found', message: prod })
        }
    } catch (error) {
        res.status(500).send({ error: `Error displaying product:  ${error}` })
    }
}

export const postProduct = async (req, res) => {
    const { title, description, stock, price, code, category } = req.body
    try {
        const response = await productModel.create({
            title, description, stock, price, code, category
        })
        if (response) {
            return res.status(201).send({ result: 'OK', message: response })
        } else {
            res.status(404).send({ error: 'Product not found' })
        }
    } catch (error) {
        if (error.code == 11000) {
            return res.status(400).send({ error: `Duplicated key` })
        } else {
            res.status(500).send({ error: `Error creating product:  ${error}` })
        }
    }
}

export const putProduct = async (req, res) => {
    const { id } = req.params
    const { title, description, stock, price, code, category, status } = req.body
    try {
        const response = await productModel.findByIdAndUpdate(id, { title, description, stock, price, code, category, status })
        if (response) {
            return res.status(200).send({ result: 'OK', message: response })
        } else {
            res.status(404).send({ result: 'Product id not found', message: response })
        }
    } catch (error) {
        res.status(500).send({ error: `Error updating product:  ${error}` })
    }
}

export const deleteProducts = async (req, res) => {
    const { id } = req.params
    try {
        const response = await productModel.deleteOne({ _id: id })
        if (response) {
            return res.status(200).send({ result: 'OK', message: response })
        } else {
            res.status(404).send({ result: 'Product id not found', message: response })
        }
    } catch (error) {
        res.status(500).send({ error: `Error deleting product:  ${error}` })
    }
}