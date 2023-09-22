/* global Flickity */
class Carousel { 
    constructor(element, options) {
        const thisCarousel = this; 
        thisCarousel.render(element);
        thisCarousel.initPlugin(options);
    }

    render(element) {
        const thisCarousel = this;
        thisCarousel.element = element;
        //console.log('thisCarousel.element', thisCarousel.element);
    }

    initPlugin(options) {
        const thisCarousel = this;
        new Flickity(thisCarousel.element, options);
    }

}

export default Carousel;