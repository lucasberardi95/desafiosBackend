export const generateProductErrorInfo = (product) => {
    return `One or more propierties were incompleted or not valid.
    List of required propierties:
    * title       : needs to be a String, received ${product.title}
    * description : needs to be a String, received ${product.description}
    * stock       : needs to be a Number, received ${product.stock}
    * price       : needs to be a Number, received ${product.price}
    * code        : needs to be a String, received ${product.code}
    * category    : needs to be a String, received ${product.category}`    
}

export const generateUserErrorInfo = (user) => {
    return `One or more propierties were incompleted or not valid.
    List of required propierties:
    * first_name : needs to be a String, received ${user.first_name}
    * last_name  : needs to be a String, received ${user.last_name}
    * email      : needs to be a String, received ${user.email}
    * password   : needs to be a String, received ${user.password}
    * age        : needs to be a Number, received ${user.age}`
}