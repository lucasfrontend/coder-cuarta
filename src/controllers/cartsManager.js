const fs = require('fs')

class CartManager {
    constructor(file) {
        this.file = file;
    }

    exists(file) {
        try {
            if (!fs.existsSync(file)) {
                throw new Error("El archivo no existe");
            } else {
                return true;
            }
        } catch (error) {
            console.log(`Error al buscar el archivo: ${error.message}`);
        }
    }

    readFile = async (file) => {
        try {
            const data = await fs.promises.readFile(file);
            return JSON.parse(data);
        } catch (error) {
            console.log(`Error al leer el archivo: ${error.message}`)
        }
    }

    writeFile = async data => {
        try {
            await fs.promises.writeFile(
                this.file, JSON.stringify(data, null, 2)
                )
            }catch(err) {
            console.log(err);
            }
        }

    createCart = async () => {
        try {
            if (!this.exists(this.file)) {
                let cartsArray = []
                const cart = {
                    id: this.#idGen(),
                    products: [],
                };
                cartsArray.push(cart)
                await this.writeFile(cartsArray)
                console.log(`El carrito fue agregado con la id: ${cart.id}`)
                return cart.id
            } else {
                if (this.readFile(this.file)) {
                const cartsArray = await this.readFile(this.file)
                if (cartsArray.length === 0 || !cartsArray) {
                    const cart = {
                        id: this.#idGen(),
                        products: [],
                    };
                    cartsArray.push(cart);
                } else {
                    const cart = {
                        id: this.#idGen(cartsArray),
                        products: [],
                    };
                    cartsArray.push(cart);
                }
                await this.writeFile(cartsArray);
                console.log(`El carrito fue agregado con la id: ${cart.id}`);
                return carts;
            }
        }
        } catch (error) {
        console.log(`Error al agregar producto: ${error.message}`);
        }
    }

    getCartById = async id => {
        try {
            if(this.exists(this.file)){
                let carts = await this.readFile(this.file)
                const cart = carts.find(item => item.id === id)
                return cart ? cart : console.log('No product found')
        }
        return console.log('La db no existe')
        } catch (error) {
            console.log(error);
        }
    }

    addToCart = async (cid, pid) => {
        try {
            if(this.exists(this.file)) {
                const carts = await this.readFile(this.file)
                const cart = carts.find(item => item.id === cid)
                console.log(cart);
            if(cart) {
                const addProduct = cart.products.find(item => item.id === pid)
                if(addProduct) {
                    addProduct.quantity++
                }else{
                    cart.products.push({id: pid, quantity: 1 })
                }
                await this.writeFile(carts)
                return cart
            }
            throw new Error(`No se encontró el carrito con el id: ${cid}`)
        }
        } catch (error) {
            console.log(error);
        }
    }

    #idGen(productsArray = []) {
        const id =
        productsArray.length === 0
            ? 1
            : productsArray[productsArray.length - 1].id + 1;
        return id;
    }
}

module.exports = CartManager