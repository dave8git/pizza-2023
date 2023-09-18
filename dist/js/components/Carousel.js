/* global Flickity */

import {select, settings, templates} from '../settings.js';
import { utils } from '../utils.js';

class Carousel extends Flickity{ 
    constructor(element, options, data) {
        super(element, options);
        const thisCarousel = this;
        
        thisCarousel.render(data); 

    }

    render(data) {
        const thisCarousel = this;
        const generatedHtml = templates.carousel(data);
        console.log('generatedHtml', generatedHtml);
        thisCarousel.element = utils.createDOMFromHTML(generatedHtml);
    }
}

export default Carousel;