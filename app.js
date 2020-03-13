let budgetController = (function() {
  let Expence = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expence.prototype.calculatePercentage = fucnction (totalIncome) {
    if(totalIncome > 0) {
      this.percentage = Math.round(this.value * 100/ totalIncome)
    } else this.percentage = -1;
  };

  Expence.prototype.getPercentage = function () {
    return this.percentage;
  }

  let Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  let calculateTotals = function(type) {
    let sum = 0;
    data.allItems[type].forEach(el => (sum += el.value));
    data.totals[type] = sum;
  };

  let data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
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

    deleteItem: function(type, id) {
      let ids, index;

      ids = data.allItems[type].map(current => current.id);

      index = ids.indexOf(id);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },

    calculateBudget: function() {
      //calculate tatal income and expenses
      calculateTotals("exp");
      calculateTotals("inc");

      //Calculate the budget: income - expenses
      data.budget = data.totals.inc - data.totals.exp;

      //Calculate the percentage of the income that we spent
      if (data.totals.inc > 0 && data.totals.exp > 0) {
        data.percentage = Math.round((data.totals.exp * 100) / data.totals.inc);
      }
    },
    
    calcPercentage: function() {
      data.allItems.exp.forEach( el =>  el.calculatePercentage())
     },

     getPercentages: function() {
       let allPerc = data.allItems.exp.map( el => el.getPercentage());
        return allPerc;

     },

    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
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
    expensesList: ".expenses__list",
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expensesLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    container: ".container"
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
        html = `<div class="item clearfix" id="inc-${object.id}">
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
        html = `<div class="item clearfix" id="exp-${object.id}">
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

    deleteListItem: function(selectorID) {
      document.querySelector(`#${selectorID}`).remove();
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
    displayBudget: function(budget) {
      document.querySelector(DOMStrings.budgetLabel).innerText = budget.budget;
      document.querySelector(DOMStrings.incomeLabel).innerText =
        budget.totalInc;
      document.querySelector(DOMStrings.expensesLabel).innerText =
        budget.totalExp;
      if (budget.percentage > 0) {
        document.querySelector(DOMStrings.percentageLabel).innerText =
          budget.percentage + "%";
      } else {
        document.querySelector(DOMStrings.percentageLabel).innerText = "----";
      }
    },
    getDOMStrings: function() {
      return DOMStrings;
    }
  };
})();

let controller = (function(budgetCntrl, UICntrl) {
  const DOM = UICntrl.getDOMStrings();

  const setupEventListeners = function() {
    document
      .querySelector(DOM.inputButton)
      .addEventListener("click", ctrlAddItem);
    document.addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        ctrlAddItem();
      }
    });
    document
      .querySelector(DOM.container)
      .addEventListener("click", ctrlDeleteItem);
  };

  const updateBudget = function() {
    //1. Calculate the budget
    budgetCntrl.calculateBudget();

    //2. Return the budget
    let budget = budgetCntrl.getBudget();

    //3. Display the budget on the UI
    UICntrl.displayBudget(budget);
  };

  const updatePercentage = function() {
    // 1.Calculate percentage
    budgetCntrl.calcPercentage();
    //2. Read pecentage from the budget controller
      let percentages = budgetCntrl.getPercentages();
    //3. Update the UI with the new percentage
    console.log(percentages);
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

      //4. Clear description and value fields
      UIController.clearFields();

      //5. Calculate and update budget
      updateBudget();
      // 6.Calculate and update percentages
      updatePercentage();
    }
  };

  let ctrlDeleteItem = function(event) {
    let itemID, splitID, type, ID;

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemID) {
      //inc-1
      splitID = itemID.split("-");
      type = splitID[0];

      ID = parseInt(splitID[1]);

      //1. delete the item from the data structure
      budgetCntrl.deleteItem(type, ID);
      //2. delete the item from the UI
      UICntrl.deleteListItem(itemID);
      //3. Update and show the new budge
      updateBudget();

      //4. update percentage
      updatePercentage();
    }
  };

  return {
    init: function() {
      UICntrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: 0
      });

      console.log("Application has started!");
      setupEventListeners();
    }
  };
})(budgetController, UIController);

controller.init();
