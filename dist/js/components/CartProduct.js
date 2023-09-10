import {select} from "./../settings.js";
import AmountWidget from "./AmountWidget.js";

class CartProduct {
    constructor(menuProduct, element) {// menuProduct - referencja do obiektu podsumowania // element - referencja do utworzonego dla produktu elementu HTML
      // menuProduct - obiekt podsumowania; // element - html wygenerowany na podstawie danych z tego obiektu
      const thisCartProduct = this;
      thisCartProduct.element = element;
      thisCartProduct.id = menuProduct.id; 
      thisCartProduct.name = menuProduct.name;
      thisCartProduct.params = menuProduct.params;
      thisCartProduct.price = menuProduct.price;
      thisCartProduct.amount = menuProduct.amount;
      thisCartProduct.priceSingle = menuProduct.priceSingle; 

      thisCartProduct.getElements(element); 
      thisCartProduct.initAmountWidget();
      thisCartProduct.initActions(); 
    }

    getElements(element) {// czyli selektory działają na elemencie poszczególnego produktu
      const thisCartProduct = this;
      thisCartProduct.dom = {}
      thisCartProduct.dom.wrapper = element; 
      thisCartProduct.dom.amountWidgetElem = element.querySelector(select.cartProduct.amountWidget);
      thisCartProduct.dom.price = element.querySelector(select.cartProduct.price);
      thisCartProduct.dom.edit = element.querySelector(select.cartProduct.edit);
      thisCartProduct.dom.remove = element.querySelector(select.cartProduct.remove);
    }

    initAmountWidget() {
      const thisCartProduct = this;
      thisCartProduct.amountWidget = new AmountWidget(thisCartProduct.dom.amountWidgetElem); //tworzymy nową instancję amountWidget 
      thisCartProduct.dom.amountWidgetElem.addEventListener('click', function () {
        thisCartProduct.amount = thisCartProduct.amountWidget.value; // korzystamy z nowej instancji amountWidget
        thisCartProduct.price = thisCartProduct.amount * thisCartProduct.priceSingle;
        thisCartProduct.dom.price.innerHTML = thisCartProduct.price;
      });
    }

    initActions() {
      const thisCartProduct = this;
      // thisCartProduct.dom.edit.addEventListener({

      // });
      thisCartProduct.dom.remove.addEventListener('click', function (e){
        e.preventDefault();
        thisCartProduct.remove(e.detail.cartProduct);
      });
    }
    remove() {
      const thisCartProduct = this;
      const event = new CustomEvent('remove', {
        bubbles: true,
        detail: {
          cartProduct: thisCartProduct,
        },
      });

      thisCartProduct.dom.wrapper.dispatchEvent(event);
    }
    prepareCartProduct() {
      const thisProduct = this;

      const productSummary = {}
      productSummary.id = thisProduct.id;
      productSummary.name = thisProduct.data.name;
      productSummary.amount = thisProduct.amountWidget.value;
      productSummary.priceSingle = thisProduct.priceSingle;
      productSummary.price = thisProduct.price;
      productSummary.params = thisProduct.prepareCartProductParams();

      return productSummary;
    }
    getData() {
      const thisCartProduct = this; 
      const data = {};
      data.id = thisCartProduct.id;
      data.amount = thisCartProduct.amount;
      data.price = thisCartProduct.price;
      data.priceSingle = thisCartProduct.priceSingle; 
      data.name = thisCartProduct.name;
      data.params = thisCartProduct.params;

      return data; 
    }
  }

  export default CartProduct;