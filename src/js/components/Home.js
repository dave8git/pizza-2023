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
        console.log('thisHome.element', thisHome.element);
    }

    getElements() { 
        const thisHome = this; 
        thisHome.dom = {};
        console.log('thisHome.element', thisHome.element);
        console.log(select.containerOf.carousel);
        thisHome.dom.carousel = thisHome.element.querySelector('.carousel-wrapper');
        console.log('thisHome.dom.carousel', thisHome.dom.carousel);
        thisHome.dom.carousel.innerHTML = thisHome.dom.carousel;
    } 

    initDataCarousel() {
        const thisHome = this;
        console.log(dataSource.carousel);
        thisHome.data = dataSource.carousel;
        console.log(thisHome.data);
    }

    initCarousel() {
        const thisHome = this; 
        thisHome.carousel = new Carousel(thisHome.data);
        console.log('thisHome.carousel', thisHome.carousel);
    }
   

}

export default Home;