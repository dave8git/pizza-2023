import {select, settings, templates} from '../settings.js';
import { dataSource } from '../data.js'
import { utils } from '../utils.js';
import Carousel from './Carousel.js';

class Home { 
    constructor() {
        const thisHome = this;
        thisHome.render();
  
        thisHome.initDataCarousel();
        thisHome.initCarousel();
        thisHome.getElements();
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
        thisHome.dom.carousel = thisHome.element.querySelector('.carousel-wrapper');
        console.log('thisHome.dom.carousel', thisHome.dom.carousel);
        thisHome.dom.carousel.innerHTML = thisHome.carousel;
    } 

    initDataCarousel() {
        const thisHome = this;
        console.log(dataSource.carousel);
        thisHome.data = dataSource.carousel;
    }

    initCarousel() {
        const thisHome = this; 
        thisHome.carousel = new Carousel(thisHome.data);
        console.log('thisHome.carousel', thisHome.carousel);
    }
   

}

export default Home;