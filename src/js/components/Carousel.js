import {select, settings, templates} from '../settings.js';
import { utils } from '../utils.js';

class Carousel { 
    constructor(data) {
        const thisCarousel = this;
        thisCarousel.render(data);
        thisCarousel.getElements(); 

    }

    render(data) {
        const thisCarousel = this;
        const generatedHtml = templates.carousel(data);
        console.log('generatedHtml', generatedHtml);
        thisCarousel.element = utils.createDOMFromHTML(generatedHtml);
    }

    getElements() { 

    }

}

export default Carousel;