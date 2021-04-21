const cartIcon = document.querySelector('.cartIcon')
const cross = document.querySelector('.cross')
const cartContainer = document.querySelector('.cartContainer')
const tbody = document.querySelector('tbody')
const itemCount = document.querySelector('.itemCount')
const totalPrice = document.querySelector('.totalPrice')

const addToCartBtns = document.querySelectorAll('.addToCart')
const items = document.querySelectorAll('.item')
/* showing cart */
cartIcon.addEventListener('click', () => {
    cartContainer.style.display = 'block'
})
/* hidding cart */
cross.addEventListener('click', () => {
    cartContainer.style.display = 'none'
})


/* creating tr for cart */

class Ui {
    appendingTr({
        id,
        img,
        itemName,
        price,
        quantity
    }) {
        const tr = document.createElement('tr')
        tr.innerHTML = `<td><div class="cartImg"><img src="${img}" alt=""> <h4>${itemName}</h4></div></td>
        <td>
            <div class="quantity">
             <div class="amount">${quantity}</div> 
            </div>
            </td>
        <td>$${price}</td>
        <td><button class="deleteBtn">delete</button></td>
        <td><input style="display:none" type="hidden" data-id="${id}"></td>`

        tbody.appendChild(tr)
    }

}



/* geting single item */
addToCartBtns.forEach((btn, index) => {
    btn.addEventListener('click', (e) => {
        let img = e.target.parentElement.children[0].getAttribute('src')
        let itemName = e.target.parentElement.children[1].textContent
        let price = e.target.parentElement.children[2].children[0].children[0].textContent;

        let id = e.target.parentElement.children[3].getAttribute("data-id")
        //console.log(id)
        let products = {
            id: id,
            img: img,
            itemName,
            price,
            quantity: 1
        }
        Store.saveToLocalStorage(products)
    })
})


/* saving to localStorage */
class Store {
    static saveToLocalStorage(products) {
        let localItem;
        if (localStorage.getItem('products') === null) {
            localItem = []
            localItem.push(products)
            localStorage.setItem('products', JSON.stringify(localItem))
        } else {
            localItem = JSON.parse(localStorage.getItem('products'))
            localItem.map((product, index) => {
                if (product.id == products.id) {
                    localItem.splice(index, 1)
                    products.quantity = product.quantity + 1;
                    products.price *= products.quantity;
                }
            })
            localItem.push(products)
            localStorage.setItem('products', JSON.stringify(localItem))
        }
        itemCount.children[0].textContent = JSON.parse(localStorage.getItem('products')).length
        window.location.reload()
    }


    /* geting all data in array formate */
    static getLocalStorageValue() {
        let localItem;
        if (localStorage.getItem('products') === null) {
            localItem = []
        } else {
            localItem = JSON.parse(localStorage.getItem("products"))
        }
        return localItem;
    }

    static useDataFromLocalStorage() {
        const products = Store.getLocalStorageValue()
        products.forEach(product => {
            const ui = new Ui()
            ui.appendingTr(product)
            
        })
    }


/* get total price */
    static getTotalPrice(){
        let total = 0;
        if (localStorage.getItem('products') === null) {
            total = 0
        } else {
            let products = JSON.parse(localStorage.getItem('products'))
            products.forEach(product=>{
                total+=Number(product.price)
            })
        }
        totalPrice.textContent = total
        
    }



    /* deleting product from localStorage */

    static deletingProduct(id){
        const products = Store.getLocalStorageValue()
        products.forEach((product,index) => {
            if(product.id == id){
                products.splice(index,1)
                localStorage.setItem('products',JSON.stringify(products))
            }
            
        })
    }
}


/* deleting single product from  ui */

    tbody.addEventListener('click',(e)=>{
        let id = e.target.parentElement.parentElement.children[4].children[0].getAttribute('data-id')
        //console.log(id)
        if(e.target.className === 'deleteBtn'){
            Store.deletingProduct(id)
            e.target.parentElement.parentElement.remove()
        }
    })



/* showing counting cart from localStorage */
window.addEventListener('DOMContentLoaded', () => {
    Store.useDataFromLocalStorage()

    Store.getTotalPrice()
    if (localStorage.getItem('products') === null) {
        itemCount.children[0].textContent = 0
    } else {
        itemCount.children[0].textContent = JSON.parse(localStorage.getItem('products')).length
    }

})