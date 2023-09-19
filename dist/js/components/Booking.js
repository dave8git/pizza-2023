import { select, templates, settings, classNames } from "./../settings.js";
import { utils } from "./../utils.js";
import AmountWidget from "./AmountWidget.js";
import HourPicker from "./HourPicker.js";
import DatePicker from "./DatePicker.js";

class Booking {
    constructor(data) {
        const thisBooking = this;
        thisBooking.data = data;
        thisBooking.tableData;
        thisBooking.render(); 
        thisBooking.initWidgets(); 
        thisBooking.getData();
        //console.log(thisBooking);
    }

    getData() {
        const thisBooking = this; 

        const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);
        const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);
      
        const params = {
            booking: [
                startDateParam, 
                endDateParam,
            ],
            eventsCurrent: [
                settings.db.notRepeatParam, 
                startDateParam, 
                endDateParam,
            ],
            eventsRepeat: [
                settings.db.repeatParam,
                endDateParam,
            ],
        };

        //console.log(thisBooking);

        const urls = {
            booking:       settings.db.url + '/' + settings.db.bookings + '?' + params.booking.join('&'),
            eventsCurrent: settings.db.url + '/' + settings.db.events   + '?' + params.eventsCurrent.join('&'),
            eventsRepeat:  settings.db.url + '/' + settings.db.events   + '?' + params.eventsRepeat.join('&'),
        }
       // console.log('urls', urls);

        // fetch(urls.booking)                  // fetch pojedyńczy - na dole promise dla wielu 
        //     .then(function(bookingsReponse){
        //         return bookingsReponse.json();
        //     })
        //     .then(function(bookings){
        //         console.log(bookings);
        //     });
        // console.log('urls.eventsCurrent', urls.eventsCurrent);
        Promise.all([
            fetch(urls.booking),
            fetch(urls.eventsCurrent),
            fetch(urls.eventsRepeat)
        ]).then(function(allResponses){ // then tworzy funkcje anonimową: function(bookingsResponse){...} // (allResponses) <-- potem np. tablicę
                const bookingsResponse = allResponses[0];
                const eventsCurrent = allResponses[1];
                const eventsRepeat = allResponses[2];
                return Promise.all([
                    bookingsResponse.json(),
                    eventsCurrent.json(),
                    eventsRepeat.json()
                ]);
            }).then(function([bookings, eventsCurrent, eventsRepeat]) { // sparsowana powyżej odpowiedź (return bookingsResponse.json()) przekazywane jest do kolejnej
                // console.log('bookings', bookings);   // funkcji anonimowej w kolejnym then - function(bookings) {...}
                // console.log('eventsCurrent', eventsCurrent);
                // console.log('eventsRepeat', eventsRepeat)
                thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
            });  
    }

    parseData(bookings, eventsCurrent, eventsRepeat){
        const thisBooking = this;

        thisBooking.booked = {};
        for(let item of bookings ) {
            thisBooking.makeBooked(item.date, item.hour, item.duration, item.table); 
        }
        for(let item of eventsCurrent) {
            thisBooking.makeBooked(item.date, item.hour, item.duration, item.table); 
        }

        const minDate = thisBooking.datePicker.minDate;
        const maxDate = thisBooking.datePicker.maxDate; 

        for(let item of eventsRepeat) {
            if(item.repeat == 'daily') {
                for(let loopDate = minDate; loopDate <= maxDate;  loopDate = utils.addDays(loopDate, 1)) {
                    thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table); 
                }
                
            }
        }
        thisBooking.updateDOM();
    }

    makeBooked(date, hour, duration, table) {
        const thisBooking = this;
        if(typeof thisBooking.booked[date] == 'undefined') {
            thisBooking.booked[date] = {};
        }

        const startHour = utils.hourToNumber(hour);

        for(let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5) {
            if(typeof thisBooking.booked[date][hourBlock] == 'undefined') {
                thisBooking.booked[date][hourBlock] = [];
            }
    
            thisBooking.booked[date][hourBlock].push(table);
        }
        //console.log(thisBooking.booked);
    }

    updateDOM() {
        const thisBooking = this; 
        thisBooking.date = thisBooking.datePicker.value;
        thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);

        let allAvailable = false; 
        thisBooking.resetTable();
        if(
            typeof thisBooking.booked[thisBooking.date] == 'undefined'
            ||
            typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined'
        ){
            allAvailable = true; 
        }

        for(let table of thisBooking.dom.tables){
            let tableId = parseInt(table.getAttribute(settings.booking.tableIdAttribute));
            if(!isNaN(tableId)){
                tableId = parseInt(tableId);
            }

            if(
                !allAvailable
                &&
                thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)
            ){
                table.classList.add(classNames.booking.tableBooked);
            } else {
                table.classList.remove(classNames.booking.tableBooked);
            }
        }
    }

    render(element) {
        const thisBooking = this;
        const generatedHTML = templates.bookingWidget(element); 
        thisBooking.element = utils.createDOMFromHTML(generatedHTML);
        //console.log('thisBooking.element', thisBooking.element);
        thisBooking.dom = {};
        thisBooking.dom.bookingContainer = document.querySelector(select.containerOf.booking);
        thisBooking.dom.bookingContainer.innerHTML = generatedHTML;
        thisBooking.dom.peopleAmount = document.querySelector(select.booking.peopleAmount);
        thisBooking.dom.hoursAmount = document.querySelector(select.booking.hoursAmount);
        thisBooking.dom.hourPicker = document.querySelector(select.widgets.hourPicker.wrapper);
        thisBooking.dom.datePicker = document.querySelector(select.widgets.datePicker.wrapper);
        thisBooking.dom.tables = thisBooking.dom.bookingContainer.querySelectorAll(select.booking.tables);
        thisBooking.dom.tableWrapper = document.querySelector(select.booking.tableWrapper);
        thisBooking.dom.phone = document.querySelector(select.booking.phone);
        thisBooking.dom.address = document.querySelector(select.booking.address);
        thisBooking.dom.starters = document.querySelectorAll(select.widgets.amount.input);
        thisBooking.dom.submit = document.querySelector(select.booking.bookingSubmit);
    }

    sendOrder() {
        //console.log('sendOrder ruszyło');
        const thisBooking = this;
        const url = settings.db.url + '/' + settings.db.bookings;
  
        const payload = {
          date: thisBooking.datePicker.value,
          hour: thisBooking.hourPicker.value,
          table: parseInt(thisBooking.tableData),
          duration: thisBooking.hoursAmount.value,
          ppl: thisBooking.peopleAmount.value,
          starters: [],
          phone: thisBooking.dom.phone.value,
          address: thisBooking.dom.address.value
        }
  
        //console.log("starters", thisBooking.dom.starters);
        for(let starter of thisBooking.dom.starters) {
            if(starter.checked == true) {
                payload.starters.push(starter.value);
            }
        }
        //console.log('payload', payload);
  
        const options = { 
          method: 'POST', 
          headers:{
            'Content-Type':'application/json',
          },
          body: JSON.stringify(payload)
        }
  
        fetch(url, options)
          .then(function(response){
            return response.json();
          }).then(function(parsedResponse){
            thisBooking.resetTable();
            thisBooking.makeBooked(payload.date, payload.hour, payload.duration, payload.table);
            thisBooking.updateDOM();
            //console.log('parsedResponse',parsedResponse);
          });
    }

    initWidgets() {
        const thisBooking = this; 
        thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
        thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
        
        thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);
        thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);

        thisBooking.dom.bookingContainer.addEventListener('updated', function() {
            thisBooking.updateDOM();
        })

        thisBooking.dom.tableWrapper.addEventListener('click', function(e) {
            //console.log('init tables się uruchamia');
            thisBooking.initTables(e);
        });

        thisBooking.dom.submit.addEventListener('click', function(e) {
            e.preventDefault(); 
            thisBooking.sendOrder();
        });

        thisBooking.dom.peopleAmount.addEventListener('click', function() {

        });

        thisBooking.dom.hoursAmount.addEventListener('click', function() {

        });
    }

    resetTable() {
        const thisBooking = this;
        thisBooking.tableData = null;
        for(let table of thisBooking.dom.tables) {
            table.classList.remove('selected');
        }

    }
    initTables(e) {
        const thisBooking = this;
        if(e.target.classList.contains('table')) {
            if(e.target.classList.contains('booked')) {
                alert("Ten stolik już zajęty jest... lalalala <-- Oddział Zamknięty tribute");
            } else {
                thisBooking.tableData = e.target.getAttribute('data-table');
                //console.log(thisBooking.tableData);
                e.target.classList.toggle('selected');
            }
        }
    }
}

export default Booking; 