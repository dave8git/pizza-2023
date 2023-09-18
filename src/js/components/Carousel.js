/* global Flickity */

import {select, settings, templates} from '../settings.js';
import { utils } from '../utils.js';

class Carousel { 
    constructor(data, wrapper) {
        const thisCarousel = this;
        thisCarousel.render(data);
        thisCarousel.getElements(); 
        thisCarousel.initializeFlkty(wrapper);

    }

    render(data) {
        const thisCarousel = this;
        const generatedHtml = templates.carousel(data);
        console.log('generatedHtml', generatedHtml);
        thisCarousel.element = utils.createDOMFromHTML(generatedHtml);
    }

    initializeFlkty(wrapper) {
        new Flickity(wrapper, {
            cellAlign: 'left',
            contain: true
        })
    }
 
    

    getElements() { 

    }

}

export default Carousel;