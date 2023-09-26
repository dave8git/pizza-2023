import { select, settings, templates } from '../settings.js';
import { utils } from '../utils.js';
import Carousel from './Carousel.js';
import Gallery from './Gallery.js';

class Home {
    constructor(homeContainer) { // constructor runs only once when class is instantiated!!!! 
        const thisHome = this;
        thisHome.homeContainer = homeContainer; 
        thisHome.getElements();
        thisHome.initDataCarousel();
    }

    render(data) {
        const thisHome = this;
        const generatedHtml = templates.home({slides: data});
        thisHome.element = utils.createDOMFromHTML(generatedHtml);
        thisHome.homeContainer.appendChild(thisHome.element);
    }

    // renderGallery(dataGallery) {
    //     const thisHome = this; 
    //     console.log(dataGallery);
    //     const generatedGallery = templates.gallery({rows: dataGallery})
    //     console.log('generatedGallery HTML', generatedGallery);
    //     thisHome.gallery = utils.createDOMFromHTML(generatedGallery);
    //     console.log('thisHome.gallery', thisHome.gallery);
    //     const galleryContainer = document.querySelector('.gallery');
    //     console.log(galleryContainer)
    //     galleryContainer.appendChild(thisHome.gallery);
    // }
    getElements() {
        const thisHome = this;
        thisHome.dom = {};
        thisHome.dom.data;
    }

    initDataCarousel() {
        const thisHome = this;
        const urlCarousel = settings.db.url + '/' + settings.db.slides;
        const urlGallery = settings.db.url + '/' + settings.db.gallery;
        console.log(urlCarousel);
        console.log(urlGallery);
        
        Promise.all([
            fetch(urlCarousel),
            fetch(urlGallery),
        ]).then(function (allResponses) {
            const carouselResponse = allResponses[0];
            const galleryResponse = allResponses[1];
            return Promise.all([
                carouselResponse.json(),
                galleryResponse.json(),
            ]);
            })
            .then(function ([carousel, gallery]) {
                console.log('parsedResponse', carousel);
                thisHome.dom.data = carousel;
                thisHome.render(thisHome.dom.data);
                thisHome.initCarousel();
                const customEvent = new Event('ready'); 
                thisHome.homeContainer.dispatchEvent(customEvent); // bąbelkowanie nie jest potrzebne ponieważ wywołujemy i nasłuchujemy (obiekt app linijka 62) na tym samym elemencie dom
                console.log('gallery data', gallery)
                //thisHome.renderGallery(gallery);
                new Gallery(gallery)
            });   
    }

    initCarousel() {
        const thisHome = this;
        const options = {
            freeScroll: true,
            cellAlign: 'left',
            contain: true
        };
        const elementWrapper = document.querySelector('.carousel-wrapper');
        thisHome.carousel = new Carousel(elementWrapper, options);
    }
}

export default Home;