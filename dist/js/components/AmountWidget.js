import { settings, select } from "./../settings.js";
import BaseWidget from './BaseWidget.js';

class AmountWidget extends BaseWidget {
    constructor(element) {
      super(element, settings.amountWidget.defaultValue);
      const thisWidget = this;
      thisWidget.getElements(element);
      // thisWidget.setValue(thisWidget.input.value=settings.amountWidget.defaultValue);
      thisWidget.initActions();
    }

    isValid(value) {
      return !isNaN(value) 
        && value <= settings.amountWidget.defaultMax 
        && value >= settings.amountWidget.defaultMin;
    }

    renderValue() {
      const thisWidget = this;

      thisWidget.dom.input.value = thisWidget.value;
    }

    getElements() {
      const thisWidget = this;

      //thisWidget.element = element;
      thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.amount.input);
      //console.log("thisWidget.dom.input", thisWidget.dom.input);
      thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);
    }

    initActions() {
      const thisWidget = this;
      //console.log(thisWidget.input.value);
      thisWidget.dom.input.addEventListener('change', function (event) {
        event.preventDefault();
        thisWidget.value = thisWidget.dom.input.value;
      });
      

      thisWidget.dom.linkDecrease.addEventListener('click', function (event) {
        event.preventDefault();
        if(thisWidget.value >= 0) {
          thisWidget.setValue(thisWidget.value-1);
        }
      });

      thisWidget.dom.linkIncrease.addEventListener('click', function (event) {
        event.preventDefault();
        if(thisWidget.value <= 9) {
          thisWidget.setValue(thisWidget.value+1);
        } 
        
      });
    }
  }

  export default AmountWidget;