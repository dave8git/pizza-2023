/* global Flickity */

import {select, settings, templates} from '../settings.js';
import { utils } from '../utils.js';
class Carousel { 
    constructor(element, options, data) {
        const thisCarousel = this;
        thisCarousel.dom = {};
        console.log('element', element);
        thisCarousel.dom.wrapper = element;
        thisCarousel.render(data, options); 

    }

    render(data, options) {
        const thisCarousel = this;
        const generatedHtml = templates.carousel({slides: data});
        console.log('generatedHtml', generatedHtml);
        thisCarousel.element = utils.createDOMFromHTML(generatedHtml);
        thisCarousel.dom.wrapper.appendChild(thisCarousel.element);
        let flkty = new Flickity(thisCarousel.dom.wrapper, options);
    }
}

export default Carousel;