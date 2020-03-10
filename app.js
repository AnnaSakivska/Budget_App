let budgetController = (function() {
  let Expence = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  let Income = function(id, description, value) {
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
    addItem: function(type, desc, val) {
      let newItem, ID;
      //Creat new ID
      if (data.allItems[type].length === 0) {
        ID = 0;
      } else {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      }

      //Creat new item base on 'inc' or 'exp' type
      if (type === "exp") {
        newItem = new Expence(ID, desc, val);
      } else if (type === "inc") {
        newItem = new Income(ID, desc, val);
      }

      //push it into our data structure
      data.allItems[type].push(newItem);

      //return our newItem
      return newItem;
    },

    caluculateBudget: function() {
      let incumSum = 0;
      let expSum = 0;
      //calculate tatal income and expenses
      data.allItems.inc.forEach(el => (incumSum += el.value));
      data.totals.inc = incumSum;
      console.log(data.totals.inc);

      data.allItems.exp.forEach(el => (expSum += el.value));
      data.totals.exp = expSum;
      console.log(expSum);

      //Calculate the budget: income - expenses
      let availableBudget = data.totals.inc - data.totals.exp;
      console.log(availableBudget);
      //Calculate the percentage of the income that we spent
      if (data.totals.inc > 0 && data.totals.exp > 0) {
        let percentage = Math.round((100 * data.totals.inc) / data.totals.exp);
        console.log(percentage);
      }
    }
  };
})();

let UIController = (function() {
  const DOMStrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputButton: ".add__btn",
    incomeList: ".income__list",
    expensesList: ".expenses__list"
  };
  return {
    getInput: function() {
      return {
        input: document.querySelector(DOMStrings.inputType).value, // Will be either inc or exp
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
      };
    },
    addAListItem: function(object, type) {
      let html;

      if (type === "inc") {
        html = `<div class="item clearfix" id="income-${object.id}">
                    <div class="item__description">${object.description}</div>
                    <div class="right clearfix">
                        <div class="item__value">${object.value}</div>
                        <div class="item__delete">
                            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                        </div>
                    </div>
                </div>`;
        document
          .querySelector(DOMStrings.incomeList)
          .insertAdjacentHTML("afterbegin", html);
      } else if (type === "exp") {
        html = `<div class="item clearfix" id="expense-${object.id}">
                    <div class="item__description">${object.description}</div>
                    <div class="right clearfix">
                        <div class="item__value">${object.value}</div>
                        <div class="item__percentage">21%</div>
                        <div class="item__delete">
                            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                        </div>
                    </div>
                </div>`;
        document
          .querySelector(DOMStrings.expensesList)
          .insertAdjacentHTML("afterbegin", html);
      }
    },
    clearFields: function() {
      let feildsArray = [
        ...document.querySelectorAll(
          DOMStrings.inputDescription + "," + DOMStrings.inputValue
        )
      ];
      feildsArray.forEach(el => (el.value = ""));
      feildsArray[0].focus();
    },
    getDOMStrings: function() {
      return DOMStrings;
    }
  };
})();

let controller = (function(budgetCntrl, UICntrl) {
  const setupEventListeners = function() {
    document
      .querySelector(DOM.inputButton)
      .addEventListener("click", ctrlAddItem);
    document.addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        ctrlAddItem();
      }
    });
  };

  const DOM = UICntrl.getDOMStrings();

  const updateBudget = function() {
    //1. Calculate the badget
    //2. Return the budget
    //3. Display the dudget on the UI
  };
  const ctrlAddItem = function() {
    let input, newItem;
    //Get the field input data
    input = UICntrl.getInput();

    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      //2. Add the item to the budget controller
      newItem = budgetCntrl.addItem(
        input.input,
        input.description,
        input.value
      );

      //3. Add the item to the UI
      UICntrl.addAListItem(newItem, input.input);

      //4. Clear description and value feilds
      UIController.clearFields();

      //5. Calculate and update budget
      updateBudget();
      budgetCntrl.caluculateBudget();
    }
  };

  return {
    init: function() {
      console.log("Application has started!");
      setupEventListeners();
    }
  };
})(budgetController, UIController);

controller.init();
