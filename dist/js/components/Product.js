import { select, templates, classNames } from "./../settings.js";
import { utils } from "./../utils.js";
import AmountWidget from './AmountWidget.js';


class Product {
    constructor(id, data) {  // konstruktor przyjmie argumenty: productData (np. cake) oraz thisApp.data.products[productData], czyli dane pod kluczem cake 
      const thisProduct = this;

      thisProduct.id = id; // productData
      thisProduct.data = data; // thisApp.data.products[productData]
      thisProduct.renderInMenu();
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
      thisProduct.initAmountWidget(); 
      thisProduct.processOrder();
      //thisProduct.prepareCartProductParams();
      //console.log('new Product:', thisProduct);
    }
    renderInMenu() {
      const thisProduct = this;
      const generatedHtml = templates.menuProduct(thisProduct.data);
      thisProduct.element = utils.createDOMFromHTML(generatedHtml);
      const menuContainer = document.querySelector(select.containerOf.menu);
      menuContainer.appendChild(thisProduct.element);
    }

    getElements() {
      const thisProduct = this;
      thisProduct.dom = {};
      thisProduct.dom.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      thisProduct.dom.form = thisProduct.element.querySelector(select.menuProduct.form);
      thisProduct.dom.formInputs = thisProduct.dom.form.querySelectorAll(select.all.formInputs);
      thisProduct.dom.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      thisProduct.dom.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
      thisProduct.dom.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
      thisProduct.dom.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
    }

    initAccordion() {
      const thisProduct = this;
      //const clickableTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      thisProduct.dom.accordionTrigger.addEventListener('click', function (event) {
        event.preventDefault();
        const activeProduct = document.querySelector(select.all.menuProductsActive);
        if (activeProduct && activeProduct !== thisProduct.element) {
          activeProduct.classList.remove(classNames.menuProduct.wrapperActive);
        }
        thisProduct.element.classList.toggle(classNames.menuProduct.wrapperActive);
      })
    }

    initOrderForm() {
      const thisProduct = this;
      thisProduct.dom.form.addEventListener('submit', function (event) {
        event.preventDefault();
        thisProduct.processOrder();
      });

      for (let input of thisProduct.dom.formInputs) {
        input.addEventListener('change', function () {
          thisProduct.processOrder();
        });
      }

      thisProduct.dom.cartButton.addEventListener('click', function (event) {
        event.preventDefault();
        thisProduct.processOrder();
        thisProduct.addToCart(); 
      })
    }

    initAmountWidget() {
      const thisProduct = this;

      thisProduct.amountWidget = new AmountWidget(thisProduct.dom.amountWidgetElem);
      thisProduct.dom.amountWidgetElem.addEventListener('updated', function () {
        thisProduct.processOrder();
      });
    }

    processOrder() {
      const thisProduct = this;
      const formData = utils.serializeFormToObject(thisProduct.dom.form);

      let price = thisProduct.data.price;
      for (let paramId in thisProduct.data.params) {
        const param = thisProduct.data.params[paramId];
        for (let optionId in param.options) {
          const option = param.options[optionId];
          const optionImage = thisProduct.dom.imageWrapper.querySelector("."+paramId+"-"+optionId);
          const optionSelected = formData[paramId] && formData[paramId].includes(optionId);
          if (optionSelected) {
            if(optionImage) {
             optionImage.classList.add('active');
            } 
            if (!option["default"]) {
              price += option["price"];
            }
          } else {
            if(optionImage) {
              optionImage.classList.remove('active');
             } 
            if (option["default"]) {
              price -= option["price"];
            }
          }
        }
      }
      thisProduct.priceSingle = price;
      price *= thisProduct.amountWidget.value;
      thisProduct.price = price;
      thisProduct.dom.priceElem.innerHTML = price;
      // console.log(thisProduct.priceSingle);
      // console.log(price);
      // console.log(thisProduct.price);
      // console.log(thisProduct);
    }
    addToCart() {
      const thisProduct = this;
      
      //app.cart.add(thisProduct.prepareCartProduct()); // instancja klasy Cart została zapisana w app na dole,i teraz mamy dostęp do jej metod
    
      const event = new CustomEvent('add-to-cart', {
        bubbles: true, 
        detail: {
            product: thisProduct,
        }
      });

      thisProduct.element.dispatchEvent(event); // odpalamy event na elemencie produktu 
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
    prepareCartProductParams() {
      const thisProduct = this;
      const formData = utils.serializeFormToObject(thisProduct.dom.form);
      const params = {};
      for (let paramId in thisProduct.data.params) {
        const param = thisProduct.data.params[paramId];
        params[paramId] = {
          label: param.label,
          options: {}
        }
        for (let optionId in param.options) {
          const option = param.options[optionId];
          const optionSelected = formData[paramId] && formData[paramId].includes(optionId);
          if(optionSelected) {
            params[paramId].options[optionId] = option.label; // musi być option.label, bez label będzie wrzucało całe obiekty option
          }
        }
      }
      return params; 
    }
  }

  export default Product;