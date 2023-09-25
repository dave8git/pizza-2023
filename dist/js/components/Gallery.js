import { templates } from '../settings.js';
import { utils } from '../utils.js';


class Gallery {
    constructor(data) { // constructor runs only once when class is instantiated!!!! 
        const thisGallery = this;
        thisGallery.getElements();
        thisGallery.renderGallery(data)
        console.log('instance of a class gallery started');
    }

    getElements() {
        const thisGallery = this;
        thisGallery.dom = {};
        thisGallery.dom.galleryContainer;
    }

    renderGallery(dataGallery) {
        const thisGallery = this; 
        const generatedGallery = templates.gallery({rows: dataGallery})
        thisGallery.gallery = utils.createDOMFromHTML(generatedGallery);
        thisGallery.galleryContainer = document.querySelector('.gallery');
        thisGallery.galleryContainer.appendChild(thisGallery.gallery);
    }
}

export default Gallery;