import {select, settings, templates} from '../settings.js';
import { dataSource } from '../data.js'
import { utils } from '../utils.js';
import Carousel from './Carousel.js';

class Home { 
    constructor() {
        const thisHome = this;
        thisHome.render();
        thisHome.getElements();
        thisHome.initDataCarousel();
        thisHome.initCarousel();
        
    }

    render() {
        const thisHome = this;
        const generatedHtml = templates.home();
        thisHome.element = utils.createDOMFromHTML(generatedHtml);
        const homeContainer = document.querySelector(select.containerOf.home);
        homeContainer.appendChild(thisHome.element);
    }

    getElements() { 
        const thisHome = this; 
        thisHome.dom = {};
    } 

    initDataCarousel() {
        const thisHome = this;
        console.log(dataSource.carousel);
        thisHome.data = dataSource.carousel;
    }

    initCarousel() {
        const thisHome = this;
        thisHome.dom.carousel = thisHome.element.querySelector('.carousel-wrapper');
       
        const options = {
            cellAlign: 'left',
            contain: true,
            autoPlay: 3000,
            // Add more options as needed
          };
        thisHome.carousel = new Carousel(thisHome.dom.carousel, options, thisHome.data);
  
    }
   

}

export default Home;