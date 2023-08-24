/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

const select = {
  templateOf: {
    menuProduct: "#template-menu-product",
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
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 0,
      defaultMax: 10,
    }
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  };

  class Product{
    constructor(id, data){  // konstruktor przyjmie argumenty: productData (np. cake) oraz thisApp.data.products[productData], czyli dane pod kluczem cake 
      const thisProduct = this;
      
      thisProduct.id = id; // productData
      thisProduct.data = data; // thisApp.data.products[productData]
      thisProduct.renderInMenu();
      thisProduct.initAccordion(); 
      console.log('new Product:', thisProduct);
      }
      renderInMenu() {
        const thisProduct = this;
        const generatedHtml = templates.menuProduct(thisProduct.data);
        thisProduct.element = utils.createDOMFromHTML(generatedHtml);
        const menuContainer = document.querySelector(select.containerOf.menu);
        menuContainer.appendChild(thisProduct.element);
      }
      initAccordion() {
        const thisProduct = this;
        const clickableTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
        clickableTrigger.addEventListener('click', function(event) {
          event.preventDefault();
          const activeProduct = document.querySelector(select.all.menuProductsActive);
          if(activeProduct && activeProduct !== thisProduct.element) {
            activeProduct.classList.remove(classNames.menuProduct.wrapperActive);
          }
          thisProduct.element.classList.toggle(classNames.menuProduct.wrapperActive);
          console.log('activeProduct', activeProduct);
          console.log('thisProduct.element', thisProduct.element)
        })
      }
    }




  const app = {
    initData: function() {
      const thisApp = this; // this wskazuje na obiekt app

      thisApp.data = dataSource; // referencja do danych pod właściwością data
    }, 

    initMenu: function() {
      const thisApp = this; // this wskazuje na obiekt app

      console.log('thisApp.data:', thisApp.data);
      for(let productData in thisApp.data.products) {
        new Product(productData, thisApp.data.products[productData]); // productData -- nazwa kategorii np. cake, breakfast itd. 
      } // thisApp.data.products[productData] -- dane w obikecie thisApp.data.products pod kluczem [productData]
      //const testProduct = new Product(); 
      //console.log('testProduct:', testProduct);

    },

    init: function(){
      const thisApp = this; // this wskazuje na obiekt app
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);
      thisApp.initData();
      thisApp.initMenu(); 
    },
  };

  app.init();
}
