const fs = require('fs')

class ProductManager {
    constructor(path) {
        this.path = path
        this.pathImg = '../public/uploads/'
    }
    writeFile = async data => {
        try {
            await fs.promises.writeFile(
                this.path, JSON.stringify(data, null, 2)
                )
            }catch(err) {
            console.log(err);
            }
        }
    getProducts = async(limit) => {
        try {
            const productsList = await fs.promises.readFile(this.path, 'utf-8')
            const products = JSON.parse(productsList)
            return products.slice(0, limit)
        }catch(error) {
            return []
            }
    }
    addProduct = async (product, imageName, imagePath) => {
        try {
            console.log('que onda??', product);
            let products = await this.getProducts()
            let newId
            let newCode = products.find(prod => prod.code === product.code)
            if (newCode) return console.log('ya se ingresó un producto con ese código')
            products.length === 0 ? newId = 1 : newId = products[products.length - 1 ].id + 1
            if(Object.values(product).every(value => value)){
                product.status === "true" ? product.status = true : product.status = false
                const thumbnail = [imageName]
                const newProduct = {...product, thumbnail: thumbnail, id: newId}
                products.push(newProduct)
                await this.writeFile(products)
                return this.getProducts()
            }
            return console.log('Todos los campos son requeridos')
        } catch (error) {
            console.log(error);
        }
    }
    updateProduct = async (id, data) => {
        try {
            const productos = await this.getProducts()
            Object.assign(productos[id-1], data)
            await this.writeFile(productos)
        } catch (error) {
            console.log(error);
        }
    }
    getProductById = async id => {
        try {
            let products = await this.getProducts()
            const product = products.find(prod => prod.id === id)
            return product ? product : console.log('Producto no encontrado')
        } catch (error) {
            console.log(error);
        }
    }
    deleteById = async id => {
        try {
            let products = await this.getProducts()
            const obj = products.filter(obj => obj.id !== id)
            await this.writeFile(obj);
            return console.log('Producto eliminado');
        } catch (error) {
            console.log(error);
        }
    }
}
module.exports = ProductManager