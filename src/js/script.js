/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
      cartProduct: '#template-cart-product', 
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input.amount',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
   
    cart: {
      productList: '.cart__order-summary',
      toggleTrigger: '.cart__summary',
      totalNumber: `.cart__total-number`,
      totalPrice: '.cart__total-price strong, .cart__order-total .cart__order-price-sum strong',
      subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',
      deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
      form: '.cart__order',
      formSubmit: '.cart__order [type="submit"]',
      phone: '[name="phone"]',
      address: '[name="address"]',
    },
    cartProduct: {
      amountWidget: '.widget-amount',
      price: '.cart__product-price',
      edit: '[href="#edit"]',
      remove: '[href="#remove"]',
    },
  };
  
  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
    cart: {
      wrapperActive: 'active',
    },
  };
  
  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }, 
    cart: {
      defaultDeliveryFee: 20,
    },
  };
  
  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
    cartProduct: Handlebars.compile(document.querySelector(select.templateOf.cartProduct).innerHTML),
  };
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
      //console.log('initOrderForm');
    }

    initAmountWidget() {
      const thisProduct = this;

      thisProduct.amountWidget = new amountWidget(thisProduct.dom.amountWidgetElem);
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
    }
    addToCart() {
      const thisProduct = this;
      console.log(thisProduct);
      app.cart.add(thisProduct.prepareCartProduct());
    }
    prepareCartProduct() {
      const thisProduct = this;

      const productSummary = {}
      productSummary.id = thisProduct.id;
      productSummary.name = thisProduct.data.name;
      productSummary.priceSingle = thisProduct.priceSingle;
      productSummary.price = thisProduct.price;
      productSummary.params = thisProduct.prepareCartProductParams();

      return productSummary;
    }
    prepareCartProductParams() {
      const thisProduct = this;
      const formData = utils.serializeFormToObject(thisProduct.dom.form);

      //let price = thisProduct.data.price;
      const params = {};
      for (let paramId in thisProduct.data.params) {
        //console.log('paramId', paramId);
        const param = thisProduct.data.params[paramId];
        params[paramId] = {
          label: param.label,
          options: {}
        }
        //console.log('param', param);
        for (let optionId in param.options) {
          //console.log('optionId', optionId);
          const option = param.options[optionId];
          //console.log('option', option);
          const optionSelected = formData[paramId] && formData[paramId].includes(optionId);
          //console.log('optionSelected', optionSelected);
          if(optionSelected) {
            params[paramId].options[optionId] = option;
          }
        }
      }
      console.log(params);
      return params; 
    }
  }

  class amountWidget{
    constructor(element) {
      const thisWidget = this;

      // console.log('AmountWidget:', thisWidget);
      // console.log('constructor arguments:', element);
      thisWidget.getElements(element);
      thisWidget.setValue(thisWidget.input.value=settings.amountWidget.defaultValue);
      thisWidget.initActions();
    }

    setValue(value) {
      const thisWidget = this;

      const newValue = parseInt(value); // input nawet o typie 'number' zawsze zwraca wartość w formacie tekstowym. 
      // jeżeli parseInt nie będzie w stanie skonwertować tego co otrzyma zwróci null
     
      if(thisWidget.value !== newValue && !isNaN(newValue) && (newValue <= settings.amountWidget.defaultMax) && (newValue >= settings.amountWidget.defaultMin)) {
        thisWidget.value = newValue;
          thisWidget.announce();
          //console.log('newValue', newValue);
      } 
      thisWidget.input.value = thisWidget.value;
    }

    getElements(element) {
      const thisWidget = this;

      thisWidget.element = element;
      thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
      thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
    }

    initActions() {
      const thisWidget = this;
      //console.log(thisWidget.input.value);
      thisWidget.input.addEventListener('change', function (event) {
        event.preventDefault();
        thisWidget.setValue(thisWidget.input.value);
      });
      

      thisWidget.linkDecrease.addEventListener('click', function (event) {
        event.preventDefault();
        if(thisWidget.value >= 0) {
          thisWidget.setValue(thisWidget.value-1);
        }
      });

      thisWidget.linkIncrease.addEventListener('click', function (event) {
        event.preventDefault();
        if(thisWidget.value <= 9) {
          thisWidget.setValue(thisWidget.value+1);
        } 
        
      });
    }

    announce() {
      const thisWidget = this; 
      const event = new Event('updated');
      thisWidget.element.dispatchEvent(event);
      //console.log(event);
    }
  }

  class Cart {
    constructor(element) {
      const thisCart = this;

      thisCart.products = [];

      thisCart.getElements(element);
      thisCart.initActions();

      console.log('new Cart', thisCart);
    }

    getElements(element) {
      const thisCart = this;

      thisCart.dom = {}; 

      thisCart.dom.wrapper = element;
      thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
      thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
    }
    initActions() {
      const thisCart = this;
      thisCart.dom.toggleTrigger.addEventListener('click', function () {
        thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
      });
    }
    add(menuProduct) {
      const thisCart = this; 
      console.log('menuProduct', menuProduct);
      const generatedHtml = templates.cartProduct(menuProduct);
      thisCart.cartProductElem = utils.createDOMFromHTML(generatedHtml);
      console.log('generatedHTML', thisCart.cartProductElem);
      thisCart.dom.productList.appendChild(thisCart.cartProductElem);
    }
  }
  const app = {
    initCart: function() {
      const thisApp = this;

      const cartElem = document.querySelector(select.containerOf.cart);
      thisApp.cart = new Cart(cartElem);
    },

    initData: function () {
      const thisApp = this; // this wskazuje na obiekt app

      thisApp.data = dataSource; // referencja do danych pod właściwością data
    },

    initMenu: function () {
      const thisApp = this; // this wskazuje na obiekt app

      //console.log('thisApp.data:', thisApp.data);
      for (let productData in thisApp.data.products) {
        new Product(productData, thisApp.data.products[productData]); // productData -- nazwa kategorii np. cake, breakfast itd. 
      } // thisApp.data.products[productData] -- dane w obikecie thisApp.data.products pod kluczem [productData]
      //const testProduct = new Product(); 
      //console.log('testProduct:', testProduct);

    },

    init: function () {
      const thisApp = this; // this wskazuje na obiekt app
      //console.log('*** App starting ***');
      //console.log('thisApp:', thisApp);
      //console.log('classNames:', classNames);
      //console.log('settings:', settings);
      //console.log('templates:', templates);
      thisApp.initData();
      thisApp.initMenu();
      thisApp.initCart();
    },
  };

  app.init();
}
