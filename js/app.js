//BUDGET CONTROLLER
var budgetController = (function(){

    // Just trying to do a liitle w/o explanation (haven't watched next lecuture)
    // var budget = [];

    // var addToIncome = function(val){
    //     budget.push(val);
    // }

    // return {
    //     addToIncome: function(val){
    //         addToIncome(val);
    //         console.log(budget);
    //     }
    // }


})();

//UI CONTROLLER
var UIController = (function (){



} )();

//GLOBAL APP CONTRLER
var Controller = (function(budgetCtrl, UICtrl){

    var ctrlAddItem = function(){
            //1. Getting item from input
            var inputValDOM = document.querySelector('.add__value');

            if (inputValDOM.value !==''){
                console.log(inputValDOM.value);
                budgetCtrl.addToIncome(inputValDOM.value);
            } else {
                alert('Input value can not be empty');
            }

           

            //2. Passing obtained value to budgetCtrl

            //3. Add item to the UI

            //4. Calculate Budget

            //5. Display budget on the UI 
    }

    document.querySelector('.add__btn').addEventListener('click',ctrlAddItem); 

    document.addEventListener('keypress', function(event){

        // Older browsers don't use keyCode so we use which for them
        if(event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();
        }
    });
   
})(budgetController, UIController);

