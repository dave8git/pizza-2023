import { select, settings, templates } from '../settings.js';
import { dataSource } from '../data.js'
import { utils } from '../utils.js';
import Carousel from './Carousel.js';

class Home {
    constructor() {
        const thisHome = this;
        thisHome.getElements();
        thisHome.render();
        thisHome.initDataCarousel();
        //thisHome.initCarousel();

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
                thisHome.initCarousel(thisHome.dom.data);
            });
           
    }

    initCarousel(data) {
        const thisHome = this;


        console.log('data', data); // Log thisHome.data, not thisHome.dom.data
        thisHome.dom.carousel = thisHome.element.querySelector('.carousel-wrapper');
    
        const options = {
            cellAlign: 'left',
            contain: true,
            autoPlay: 3000,
            // Add more options as needed
        };
        console.log('data from Home', data);
        thisHome.carousel = new Carousel(thisHome.dom.carousel, options, data);
    
    }


}

export default Home;