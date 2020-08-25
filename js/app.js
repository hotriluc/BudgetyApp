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

    var data = {
        allItems: {
            inc: [],
            exp: []
        },
        totals: {
            inc: 0,
            exp: 0
        }
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
            console.log(data);
            //Returning added item
            return newItem;
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
        inputButton: '.add__btn'
        
    }

  
    return {
        getInputVal: function(){
                return {
                    type: document.querySelector(domStrings.inputType).value,
                    description: document.querySelector(domStrings.inputDescription).value,
                    value: document.querySelector(domStrings.inputValue).value
                }
        },
        //Getting acceses to private fields supposed to be by using getters 
        getDOM: function(){
            return domStrings;
        }
    }

} )();

//GLOBAL APP CONTRLER
var Controller = (function(budgetCtrl, UICtrl){

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

    var ctrlAddItem = function(){
        var input, newItem;

            //1. Getting item from input
            input = UICtrl.getInputVal();
            console.log( input.type,input.description, input.value);
            //2. Passing obtained value to budgetCtrl
            newItem = budgetCtrl.addItem(input.type,input.description, input.value)

            //3. Add item to the UI

            //4. Calculate Budget

            //5. Display budget on the UI 
    }



    //Returning object 
   return {
       init: function (){
           console.log('Application has been started');
           settingEventListreners();
       }
   };

})(budgetController, UIController);

Controller.init();