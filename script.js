////////////////////
// COUNTER CONTROLER
////////////////////

var counterControler = (function() {

    var PersonA = function(id, description, value, destiny) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.destiny = destiny;
    };

    var PersonB = function(id, description, value, destiny) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.destiny = destiny;
    };

    var calculateTotal = person => {
        var sum = 0;
        informations.items[person].forEach(function(value) {
            sum = sum + value.value;
        });

        informations.totals[person] = sum;

    };


    var informations = {
        items: {
            perA: [],
            perB: []
        },
        totals: {
            perA: 0,
            perB: 0
        },
        summary: 0
    };

    return {

        addItem: (person, description, value, destiny) => {
              var newItem, ID;

              if (informations.items[person].length > 0) {
                  ID = informations.items[person][informations.items[person].length - 1].id + 1;
              } else {
                  ID = 0;
              }

              if(person == 'perA') {
                  newItem = new PersonA(ID, description, value, destiny);
              } else if (person == 'perB') {
                  newItem = new PersonB(ID, description, value, destiny);
              }

              informations.items[person].push(newItem);

              return newItem;
        },

        deleteItem: function(person, id) {
            var ids, index;

            ids = informations.items[person].map(function(value) {
                return value.id
            });

            index = ids.indexOf(id);

            if(index !== -1) {
                informations.items[person].splice(index, 1);
            }
        },

        calculateAll: function() {
          calculateTotal('perA');
          calculateTotal('perB');

          let summary;

          if (informations.totals.perA > informations.totals.perB) {

              summary = informations.totals.perA - informations.totals.perB;

          } else if(informations.totals.perB > informations.totals.perA) {
              summary = informations.totals.perB - informations.totals.perA;
            }

          informations.summary = summary;
        },

        getSummary: function() {
            return {
                totalPerA: informations.totals.perA,
                totalPerB: informations.totals.perB,
                summary: informations.summary
            };
        },

        testing: function() {
            return(informations);
        }
    }

 })();

///////////////////
// UI controler
///////////////////

var UIControler = (function() {

    var DOMStrings = {
        inputPerson: '.name',
        inputDescription: '.description',
        inputValue: '.value',
        inputDestiny: '.destiny',
        inputButton: '.summary-btn',
        personAContainer: '.personA',
        personBContainer: '.personB',
        personATotal: '.perA',
        personBTotal: '.perB',
        summary: '.summary',
        shoppingLabel: '.shopping-label'
    };

    return {
        getInput: function() {
            return {
                person: document.querySelector(DOMStrings.inputPerson).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value.replace(',', '.')),
                destiny: document.querySelector(DOMStrings.inputDestiny).value
            };
        },

        addListItem: function(obj, person) {
            var html, newHtml, element;

            if (person === 'perA') {
                element = DOMStrings.personAContainer;

                html = '<div class="item" id="perA-%id%"><span>%description%</span><div>+%value% zł<button class="item-delete-btn"><i class="far fa-times-circle"></i></button></div></div>';
            } else if (person === 'perB') {
                element = DOMStrings.personBContainer;

                html = '<div class="item"  id="perB-%id%"><span>%description%</span><div>+%value% zł<button class="item-delete-btn"><i class="far fa-times-circle"></i></button></div></div>';
            }

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItem: function(selektorID) {
            var el = document.getElementById(selektorID);

            el.parentNode.removeChild(el);
        },

        displaySummary: function(obj) {
            document.querySelector(DOMStrings.personATotal).textContent = `${obj.totalPerA} zł`;
            document.querySelector(DOMStrings.personBTotal).textContent = `${obj.totalPerB} zł`;

              if (obj.totalPerA == obj.totalPerB) {
                  document.querySelector(DOMStrings.summary).textContent = `Rachunki wyrównane!`;
              } else if(obj.totalPerA > obj.totalPerB) {
                  document.querySelector(DOMStrings.summary).textContent = `Mateusz jest winny Iwecie ${obj.summary} zł`;
              } else if(obj.totalPerB > obj.totalPerA) {
                  document.querySelector(DOMStrings.summary).textContent = `Iweta jest winna Mateuszowi ${obj.summary} zł`;
                }
        },

        clearFields: function() {
            var fields, fieldsArray;

            fields = document.querySelectorAll(`${DOMStrings.inputDescription}, ${DOMStrings.inputValue}`);

            fieldsArray = Array.prototype.slice.call(fields);

            fieldsArray.forEach(value => value.value = "");

            fields[0].focus();
        },

        getDOMStrings: function() {
            return DOMStrings;
        }

    }

 })();

///////////////////////
//APLICATION CONTROLER
///////////////////////

var appControler = (function(counterCtrl, UICtrl) {

    var setupEventListeners = () => {
        var DOM = UIControler.getDOMStrings();

        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', ev => {
            if(ev.keyCode === '13' || ev.which === 13) {
                ctrlAddItem()
            }
        });

        document.querySelector(DOM.shoppingLabel).addEventListener('click', ctrlDeleteItem);
    };

    var updateCalculations = function() {
        counterCtrl.calculateAll();

        var calculations = counterCtrl.getSummary();

        UICtrl.displaySummary(calculations);

    };

    var ctrlAddItem = function() {
        var input, newItem, inputDestination;

        input = UICtrl.getInput();

        if(input.description !== "" && !isNaN(input.value) && input.value > 0) {

            if(input.destiny == 'option1') {
                inputDestination = input.value / 2;

                newItem = counterControler.addItem(input.person, input.description, inputDestination, input.destiny);

            } else if (input.destiny == 'option2') {
                newItem = counterControler.addItem(input.person, input.description, input.value, input.destiny);
            }

            UICtrl.addListItem(newItem, input.person);

            updateCalculations();

            UICtrl.clearFields();
        }
    };

    var ctrlDeleteItem = function(event) {
        var itemID, splitID, person, ID;
        itemID = event.target.parentNode.parentNode.parentNode.id;

        if(itemID) {
            splitID = itemID.split('-');
            person = splitID[0];
            ID = parseInt(splitID[1]);

            counterCtrl.deleteItem(person, ID);
            UICtrl.deleteListItem(itemID);

            updateCalculations();
        }
    };


    return {
        init: function() {
            UICtrl.displaySummary({
                totalPerA: 0,
                totalPerB: 0
            });

            setupEventListeners();
        }
    };

 })(counterControler, UIControler);

appControler.init();