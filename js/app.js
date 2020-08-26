//BUDGET CONTROLLER
var budgetController = (function(){
   
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(current){
            sum+=current.value;
        })

        data.totals[type] = sum;
    }

    var data = {
        allItems: {
            inc: [],
            exp: []
        },
        totals: {
            inc: 0,
            exp: 0
        },
        budget:0,
        percentage: -1
    }

    return {

        addItem: function (type, description, value){
            
            var newItem, ID;
            // id: [1, 4, 7 ] nextId will be 7.id + 1
            // id = lastid + 1

            //Creating ID
            // If length of array is 0 then id 0 (removing that condition 
            //will mess up our function that calculate id because it will point at array[-1] which contains nothing)  
            if(data.allItems[type].length===0){
                ID = 0;
            } else{ ID = data.allItems[type][data.allItems[type].length - 1].id + 1;}

            //Creating new item depens on type
            if (type ==='inc'){
               var newItem = new Income(ID, description, value);
            } else {
                var newItem = new Expense(ID, description, value);
            }

            //Push to data structure
            data.allItems[type].push(newItem);
            //console.log(data);
            //Returning added item
            return newItem;
        },

        //method that calculates 
        calculateBudget:  function(){
            //calcultating total income and expenses
            calculateTotal('inc');
            calculateTotal('exp');

            //calculate budget income - expenses
            data.budget = data.totals.inc - data.totals.exp;
            //caclucalte the percentage of income that we spent
            if (data.totals.inc > data.totals.exp){
                data.percentage = Math.round((data.totals.exp / data.totals.inc)*100);
            } else {
                data.percentage = -1;
            }

            return data.budget;
        },

        //Returning Budget, total income,total expneses and percentage
        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },
        
        testing: function(){
            console.log(data);
           }
        
    };



})();

//UI CONTROLLER
var UIController = (function (){
    

    //private field
    var domStrings  = {
        inputType: '.add__type',
        inputValue:'.add__value',
        inputDescription: '.add__description',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        expensesPercentageLabel: '.budget__expenses--percentage'
    }

  
    return {
        //public method that returns user input values as an object
        getInputVal: function(){
                return {
                    type: document.querySelector(domStrings.inputType).value,
                    description: document.querySelector(domStrings.inputDescription).value,
                    value: parseFloat(document.querySelector(domStrings.inputValue).value)
                }
        },
        

        //Adding list item to ui
        // shows added item into the UI ( we passing Income/Expenses object and type ('exp','inc')
        addListItem: function(obj, type){
            var html, newHTML, listDOM;
            //Creating HMTL placeholder depending on type
            if(type ==='inc'){
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                listDOM = document.querySelector(domStrings.incomeContainer);
            } else { 
                html = ' <div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">%percentage%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                listDOM = document.querySelector(domStrings.expensesContainer);
            }

            //Replacing actual data into placehlder
            newHTML = html.replace('%id%',obj.id);
            newHTML = newHTML.replace('%description%', obj.description);
            newHTML = newHTML.replace('%value%', obj.value);

            //Adding placeholder into the DOM
            listDOM.insertAdjacentHTML('beforeend',newHTML);

        },

        //Getting acceses to private fields supposed to be by using getters 
        getDOM: function(){
            return domStrings;
        },

        //Clear input fields 
        clearInputFields: function(){
            //returning list 
            var fields = document.querySelectorAll(domStrings.inputValue+', '+domStrings.inputDescription);

            //Calling slice method of Array constructor and pointing this to fields variable()
            // so slice method would think that fields is an array
            var fieldsArr = Array.prototype.slice.call(fields);

            fields.forEach( function(current, index , array){
                current.value = '';
            });
            //Focusing to the first input after clearing all filed
            // It means that after inputing and adding item 
            // user will be able to input description (no need to click to field)
            fieldsArr[0].focus();
        },


        //Displaying BUDGET (TOP PART) on the UI
        // we passing object(watch getBudget() method in Budget
        // controller) that consists parameters such as budget, total income, total expenses, percentage
        displayBudget: function(obj){
            
             //Display budget on the UI
             document.querySelector(domStrings.budgetLabel).textContent = obj.budget;
             //Display total income on the UI
            document.querySelector(domStrings.incomeLabel).textContent = obj.totalInc;
             //Dislay total expenses on the UI
            document.querySelector(domStrings.expensesLabel).textContent = obj.totalExp;
             //Display percentage expense depends to income
             if(obj.percentage > 0){
                document.querySelector(domStrings.expensesPercentageLabel).textContent = obj.percentage + '%';
             } else {
                document.querySelector(domStrings.expensesPercentageLabel).textContent = '-';
             }
        }


        
    }

} )();

//GLOBAL APP CONTRLER
var Controller = (function(budgetCtrl, UICtrl){

    //Setting  EvenListeners
    var settingEventListreners = function() {
        var uiDOM = UICtrl.getDOM();

        document.querySelector(uiDOM.inputButton).addEventListener('click',ctrlAddItem); 

        document.addEventListener('keypress', function(event){
            // Older browsers don't use keyCode so we use which for them
            if(event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
    }

    var UpdateBudget = function(){
        //1. Calculate Budget
        budgetCtrl.calculateBudget();
        //2. return the budget
        var budget = budgetCtrl.getBudget();
        //3. Display budget on the UI 
        console.log(budget);
        UICtrl.displayBudget(budget);

    }


    var ctrlAddItem = function(){
        var input, newItem;

            //1. Getting item from input
            input = UICtrl.getInputVal();
            //Checking if value is a number and there is a decription
            if(input.value > 0 && !isNaN(input.value) && input.description!==''){
                //2. Passing obtained value to budgetCtrl
                newItem = budgetCtrl.addItem(input.type,input.description, input.value)

                //3. Add item to the UI
                UICtrl.addListItem(newItem, input.type);
                //clearing fields
                UICtrl.clearInputFields();

                //calculate and update budget
                UpdateBudget();
            } 
           
    }


    //Returning object 
   return {
       init: function (){
           console.log('Application has been started');
           
           //Displaying zero budget
           UICtrl.displayBudget({budget: 0,
            totalInc: 0,
            totalExp: 0,
            percentage: 0});

           settingEventListreners();
       }
   };

})(budgetController, UIController);

Controller.init();