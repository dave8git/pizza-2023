/* global Flickity */
class Carousel { 
    constructor(element) {
        const thisCarousel = this; 
        thisCarousel.render(element);
        thisCarousel.initPlugin();
    }

    render(element) {
        const thisCarousel = this;
        thisCarousel.element = element;
    }

    initPlugin() {
        const thisCarousel = this;
        new Flickity(thisCarousel.element);
    }

}

export default Carousel;