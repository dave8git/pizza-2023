import { settings, select, classNames } from "./settings.js";
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Booking from './components/Booking.js';
import Home from './components/Home.js';

const app = {
    initBooking: function() {
       const thisApp = this;
       const bookingElem = document.querySelector(select.containerOf.booking);
       thisApp.booking = new Booking(bookingElem);
    },
    initPages: function() {
      const thisApp = this;
      thisApp.pages = document.querySelector(select.containerOf.pages).children;
      thisApp.navLinks = document.querySelectorAll(select.nav.links);

      const idFromHash = window.location.hash.replace('#/', '');

      let pageMatchingHash = thisApp.pages[0].id; 

      for(let page of thisApp.pages) {
        if(page.id == idFromHash) {
          pageMatchingHash = page.id;
          break;
        }
      }

      thisApp.activatePage(pageMatchingHash);

      for(let link of thisApp.navLinks) {
        link.addEventListener('click', function(event){
          const clickedElement = this; 
          event.preventDefault(); 

          const id = clickedElement.getAttribute('href').replace('#', '');
          thisApp.activatePage(id);
          window.location.hash = '#/' + id;
        });
      }
     

    },

    activatePage: function(pageId) {
      const thisApp = this; 

      for (let page of thisApp.pages) {
          page.classList.toggle(classNames.pages.active, page.id == pageId);
      }

      for (let link of thisApp.navLinks) {
        link.classList.toggle(
          classNames.nav.active, 
          link.getAttribute('href') == '#' + pageId
        );
    }
    },
    initHome: function() {
      const thisApp = this; 
      thisApp.home = new Home();

      //console.log('thisApp.home', thisApp.home);
    },

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
          //console.log('parsedResponse', parsedResponse);
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
      thisApp.initPages();
      thisApp.initData();
      //thisApp.initMenu();
      thisApp.initHome();
      thisApp.initCart();
      thisApp.initBooking();
    },
  };

  app.init();
