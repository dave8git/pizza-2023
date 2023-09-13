import { select, settings, classNames, templates } from "./../settings.js";
import { utils } from "./../utils.js";
import AmountWidget from "./AmountWidget.js";
import CartProduct from "./CartProduct.js";

class Booking {
    constructor(data) {
        const thisBooking = this;
        thisBooking.data = data;
        thisBooking.render(); 
        thisBooking.initWidgets(); 
    }

    render(element) {
        const thisBooking = this;
        const generatedHTML = templates.bookingWidget(element); 
        thisBooking.element = utils.createDOMFromHTML(generatedHTML);
        thisBooking.dom = {};
        thisBooking.dom.bookingContainer = document.querySelector(select.containerOf.booking);
        console.log(thisBooking.element);
        console.log(thisBooking.dom.bookingContainer);
        thisBooking.dom.bookingContainer.innerHTML = generatedHTML;
        thisBooking.dom.peopleAmount = document.querySelector(select.booking.peopleAmount);
        thisBooking.dom.hoursAmount = document.querySelector(select.booking.hoursAmount);
    }

    initWidgets() {
        const thisBooking = this; 
        thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
        thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);

        thisBooking.dom.peopleAmount.addEventListener('click', function() {

        });

        thisBooking.dom.hoursAmount.addEventListener('click', function() {

        });
    }
}

export default Booking; 