import { select, settings, classNames, templates } from "./../settings.js";
import { utils } from "./../utils.js";
import CartProduct from "./CartProduct.js";

class Cart {
    constructor(element) {
      const thisCart = this;

      thisCart.products = [];

      thisCart.getElements(element);
      thisCart.initActions();
    }

    getElements(element) {
      const thisCart = this;

      thisCart.dom = {}; 

      thisCart.dom.wrapper = element;
      thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
      thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
      thisCart.dom.deliveryFee = thisCart.dom.wrapper.querySelector(select.cart.deliveryFee);
      thisCart.dom.subtotalPrice = thisCart.dom.wrapper.querySelector(select.cart.subtotalPrice);
      thisCart.dom.totalPrice = thisCart.dom.wrapper.querySelectorAll(select.cart.totalPrice);
      thisCart.dom.totalNumber = thisCart.dom.wrapper.querySelector(select.cart.totalNumber);
      thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
    }
    initActions() {
      const thisCart = this;
      thisCart.dom.toggleTrigger.addEventListener('click', function () {
        thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
      });
      thisCart.dom.productList.addEventListener('updated', function() {
        thisCart.update();
      });
      thisCart.dom.productList.addEventListener('remove', function(e) {
        thisCart.remove(e.detail.cartProduct); //można przesłać e.detail.cartProduct, bo był przekazany przy tworzeniu eventu remove w klasie CartProduct
      });
      thisCart.dom.form.addEventListener('submit', function(e) {
        e.preventDefault();
        thisCart.sendOrder();
      })
    }
    add(menuProduct) {
      const thisCart = this; 
      const generatedHTML = templates.cartProduct(menuProduct);
      const generatedDOM = utils.createDOMFromHTML(generatedHTML);
      thisCart.dom.productList.appendChild(generatedDOM);

      thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
      thisCart.update();
    }
    update() {
      const thisCart = this;
      thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
      thisCart.totalNumber = 0;
      thisCart.subtotalPrice = 0; 

      for(let product of thisCart.products) {
        // console.log(product.price);
        // console.log(product.amount);
        thisCart.totalNumber += product.amount;
        thisCart.subtotalPrice += product.price;
        // console.log('product', product);
        // console.log(product.amount);
        // console.log(thisCart.totalNumber);
        // console.log(thisCart.subtotalPrice);
        // console.log('product', product);
      }
      
      thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;
      thisCart.dom.deliveryFee.innerHTML = thisCart.deliveryFee;
      thisCart.dom.subtotalPrice.innerHTML = thisCart.subtotalPrice;
      for (let total of thisCart.dom.totalPrice) {
        total.innerHTML = thisCart.subtotalPrice + thisCart.deliveryFee;
      }
      thisCart.dom.totalPrice.innerHTML = thisCart.totalPrice;
      thisCart.dom.totalNumber.innerHTML = thisCart.totalNumber;

      // console.log('subtotalPrice',thisCart.subtotalPrice);
      // console.log('thisCart.totalPrice', thisCart.totalPrice);
    }
    remove(cartProduct) {
      const thisCart = this;
      cartProduct.dom.wrapper.remove(); 
      const index = thisCart.products.indexOf(cartProduct); 
      thisCart.products.splice(index, 1);
      thisCart.update();
    }
    sendOrder() {
      const thisCart = this;
      const url = settings.db.url + '/' + settings.db.orders;

      const payload = {
        address: thisCart.dom.form.address.value,
        phone: thisCart.dom.form.phone.value,
        totalPrice: thisCart.totalPrice,
        subtotalPrice: thisCart.subtotalPrice,
        totalNumber: thisCart.totalNumber,
        deliveryFee: thisCart.deliveryFee,
        products: []
      }

      for(let prod of thisCart.products) {
        payload.products.push(prod.getData());
      }
      //console.log('payload', payload);

      const options = { 
        method: 'POST', 
        headers:{
          'Content-Type':'application/json',
        },
        body: JSON.stringify(payload)
      }

      fetch(url, options)
        .then(function(response){
          return response.json();
        }).then(function(parsedResponse){
          //console.log('parsedResponse',parsedResponse);
        });
    }
  }

  export default Cart;