import { select, settings, templates } from '../settings.js';
import { utils } from '../utils.js';
import Carousel from './Carousel.js';

class Home {
    constructor() { // constructor runs only once when class is instantiated!!!! 
        const thisHome = this;
        thisHome.getElements();
        thisHome.initDataCarousel();
    }

    render(data) {
        const thisHome = this;
        const generatedHtml = templates.home({slides: data});
        thisHome.element = utils.createDOMFromHTML(generatedHtml);
        const homeContainer = document.querySelector(select.containerOf.home);
        homeContainer.appendChild(thisHome.element);
    }

    getElements() {
        const thisHome = this;
        thisHome.dom = {};
        thisHome.dom.data;
    }

    initDataCarousel() {
        const thisHome = this;
        const urlCarousel = settings.db.url + '/' + settings.db.slides
        console.log(urlCarousel);
        fetch(urlCarousel)
            .then(function (rawResponse) {
                return rawResponse.json();
            })
            .then(function (parsedResponse) {
                console.log('parsedResponse', parsedResponse);
                thisHome.dom.data = parsedResponse;
                thisHome.render(thisHome.dom.data);
                thisHome.initCarousel();
            });

           
    }

    initCarousel() {
        const thisHome = this;
        const options = {
            cellAlign: 'left',
            contain: true
        };
        const elementWrapper = document.querySelector('.carousel-wrapper');
        thisHome.carousel = new Carousel(elementWrapper, options);
    
    }


}

export default Home;