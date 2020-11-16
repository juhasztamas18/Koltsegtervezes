//Költség tervezés modul
let koltsegController = (function() {

    let Expens = function(id,description, value) {
        this.id = id;
        this.description = description;
        this.value = value;  
    };

    let Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;  
    };

    let adatok = {
        mindenAdat: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    }

    return {

        addItem: function(type,desc,value) {
            let newItem,ID;
            //ID generálása tipusonként külön 
            if (adatok.mindenAdat[type].length>0)
            ID = adatok.mindenAdat[type][adatok.mindenAdat[type].length -1].id+1;
            else ID=0;

            //Új elem létrehozása a szerint hogy ecp vagy inc
            if (type==='exp') {
                newItem = new Expens (ID, desc, value);
            } else if(type==='inc') {
                newItem = new Income(ID, desc, value);
            } 
            //az új elem hozzáadása  a adatok.mindenAdat tömbhoz
            adatok.mindenAdat[type].push(newItem);

            return newItem;

        },

        testing: function() {
            console.log(adatok);
        }
    };

  

})();

//UserInterface modul
let uiController = (function(){

    let DOMstrings = {
        type: '.add__type',
        desc: '.add__description',
        value: '.add__value',
        inputBtn : '.add__btn',
        incomeContainer: '.income__list',
        expensContainer: '.expenses__list',
    };


    
    return {
        getinput: function() {
            return {
                type : document.querySelector(DOMstrings.type).value,
                desc : document.querySelector(DOMstrings.desc).value,
                value : parseFloat(document.querySelector(DOMstrings.value).value),
            };
        },

        getDOMstrings: function() {
            return DOMstrings;
        },

        addListItem : function(obj,type) {
            //Create HTML string with placeholder
            let html,newHTML,element;

            if (type==='inc'){
                element = DOMstrings.incomeContainer;
                html= '<div class="item clearfix" id="income-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type==='exp') {
                element = DOMstrings.expensContainer;
                html= '<div class="item clearfix" id="expense-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            


            //REpelace the placeholder text with actual data
            newHTML = html.replace('%id%',obj.id);
            newHTML = newHTML.replace('%desc%',obj.description);
            newHTML = newHTML.replace('%value%',obj.value);
            //insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend',newHTML);
            

        },

        clearFilds : function(){
            let filds,fieldsArray;
            filds = document.querySelectorAll(DOMstrings.desc + ', '+DOMstrings.value);
            fieldsArray = Array.prototype.slice.call(filds);
            fieldsArray.forEach(function(cur){
                cur.value="";
            });
            fieldsArray[0].focus();
        },
    };

})();

 //App modul 
    let controller = (function(koltCtrl,uiCtrl){

    let setEvelisteners = function () {
        let DOM = uiCtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem)
        document.addEventListener('keypress',function(event){
           if (event.keyCode===13 || event.which===13) {
               ctrlAddItem();
           } 
       
        })
    };
    
    let ctrlAddItem = function () {
        let input,newItem;
    
        //1. Kiikérni az adatot a mezőből
        input = uiCtrl.getinput();

        if(input.desc !=="" && !isNaN(input.value) && input.value>0) {
        //2. Oda adni a kontrollernek
            newItem = koltCtrl.addItem(input.type, input.desc, input.value);
        //3. Hozzá adni az UI és törlöni az aktot
            uiCtrl.addListItem(newItem,input.type);
            uiCtrl.clearFilds();
        //4. Kiszámolni az összeget
        //5. Kiszámolni az összeget
     }
     
     
    };
    return {
        init:function(){  
            setEvelisteners();
            console.log('Application has started!');
        }
    };

})(koltsegController,uiController);
controller.init();
