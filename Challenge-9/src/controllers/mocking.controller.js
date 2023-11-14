import { faker } from '@faker-js/faker'

export const createProduct = async (req, res) => {
    try {
        const products = []
        let i = 0
        while (i < 100) {
            const product = {
                _id: faker.database.mongodbObjectId(),
                title: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                category: faker.commerce.department(),
                price: faker.commerce.price(),
                stock: faker.number.int({ min: 1, max: 500 }),
                code: faker.string.uuid(),
                status: faker.datatype.boolean(),
                thumbnail: [],
            }
            products.push(product)
            i++;
        }
        console.log(products)
        return res.status(200).send({ result: 'OK', message: products })
    } catch (error) {
        res.status(500).send({ error: `Error creating product:  ${error}` })
    }
}
