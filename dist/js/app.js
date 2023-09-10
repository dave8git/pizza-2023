import { settings, select } from "./settings.js";
import Product from './components/Product.js';
import Cart from './components/Cart.js';

const app = {
    initCart: function() {
      const thisApp = this;

      const cartElem = document.querySelector(select.containerOf.cart);
      thisApp.cart = new Cart(cartElem);

      thisApp.productList = document.querySelector(select.containerOf.menu); // lista wszystkich produktów dowie się o odpalonym customowym evencie w add-to-cart (w Product)
      thisApp.productList.addEventListener('add-to-cart', function(event) { // dodajemy eventListener aby wychwycić customowy event
        app.cart.add(event.detail.product);
      }); 
    },

    initData: function () {
      const thisApp = this; // this wskazuje na obiekt app

      thisApp.data = {}; // referencja do danych pod właściwością data
      const url = settings.db.url + '/' + settings.db.products;
      fetch(url) 
        .then(function(rawResponse) {
          return rawResponse.json(); 
        })
        .then(function(parsedResponse){
          console.log('parsedResponse', parsedResponse);
          thisApp.data.products = parsedResponse; /* save parsedResponse as thisApp.data.products */
          thisApp.initMenu();/* execute initMenu method */
        });

        console.log('thisApp.data', JSON.stringify(thisApp.data)); //ten console.log wyświetli się wcześniej niż console.log('parsedResponse', parasedResponse), bo jest zaraz po udanym fetch, a tamten console log, jest po then
    },

    initMenu: function () {
      const thisApp = this; // this wskazuje na obiekt app

      //console.log('thisApp.data:', thisApp.data);
      for (let productData in thisApp.data.products) {
        new Product(thisApp.data.products[productData], thisApp.data.products[productData]); // productData -- nazwa kategorii np. cake, breakfast itd. 
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
      //thisApp.initMenu();
      thisApp.initCart();
    },
  };

  app.init();
