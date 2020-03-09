let budgetController = (function () {
    let Expence = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    let Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    let data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };
    return {
        addItem: function (type, desc, val) {
            let newItem, ID;
            //Creat new ID
            if (data.allItems[type].length === 0) {
                ID = 0
            } else {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }

            //Creat new item base on 'inc' or 'exp' type
            if (type === 'exp') {
                newItem = new Expence(ID, desc, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, desc, val);
            }

            //push it into our data structure
            data.allItems[type].push(newItem);

            //return our newItem
            return newItem;
        }
    }
})();

let UIController = (function () {
    const DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn'
    };
    return {
        getInput: function () {
            return {
                input: document.querySelector(DOMStrings.inputType).value, // Will be either inc or exp
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value
            }
        },
        getDOMStrings: function () {
            return DOMStrings;
        }
    }
})();

let controller = (function (budgetCntrl, UICntrl) {

    const setupEventListeners = function () {
        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);
        document.addEventListener("keypress", function (event) {
            if (event.key === 'Enter') {
                ctrlAddItem();
            }
        })
    };

    const DOM = UICntrl.getDOMStrings();
    const ctrlAddItem = function () {
        let input, newItem;
        //Get the field input data
        input = UICntrl.getInput();
        //2. Add the item to the budget controller
        newItem = budgetCntrl.addItem(input.input, input.description, input.value);
        console.log(newItem);
    };

    return {
        init: function () {
            console.log("Application has started!");
            setupEventListeners()
        }
    }

})(budgetController, UIController);

controller.init();