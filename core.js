//Költség tervezés modul
let koltsegController = (function() {

    let Expens = function(id,description, value) {
        this.id = id;
        this.description = description;
        this.value = value;  
        this.percentage = -1;
    };

    Expens.prototype.calculatePercentage = function(totalInc) {
        if (totalInc>0) {
            this.percentage = Math.round((this.value / totalInc)*100);
        } else {
            this.percentage = -1; 
        }       
    };

    Expens.prototype.getPercentage = function () {
        return this.percentage;
    }

    let Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;  
    };  

    let calculateTotal = function(type) {
        let sum=0;
        adatok.mindenAdat[type].forEach(function(cur){
            sum += cur.value;
        });
        adatok.totals[type] = sum;
    };

    let adatok = {
        mindenAdat: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }, 
        budget:0,
        percentage:-1,
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

        deleteItem : function (type,id) {
            //id=3
            let ids,index;
            ids = adatok.mindenAdat[type].map(function (cur) {
                return cur.id;
            });
            index = ids.indexOf(id);
            if (index!==-1) {
                adatok.mindenAdat[type].splice(index,1);
            };
        },

        testing: function() {
            console.log(adatok);
        },


        calculateBudget: function() {
            //kiszámolni a össz inc és exp
            calculateTotal('exp');
            calculateTotal('inc');

            //Kiszámolni a költséget: inc-exp
            adatok.budget = adatok.totals.inc - adatok.totals.exp;
            
            //Kiszámolni a százalékot
            if(adatok.totals.inc>0) {
                adatok.percentage = Math.round((adatok.totals.exp / adatok.totals.inc)*100);
            } else adatok.percentage = -1;
        },
        getBudget: function(){
            return {
                budget: adatok.budget,
                totalInc : adatok.totals.inc,
                totalExp: adatok.totals.exp,
                percentage: adatok.percentage,
            }
        },
        calculatePercentages: function() {
            adatok.mindenAdat.exp.forEach(function(cur) {
                cur.calculatePercentage(adatok.totals.inc);
            });

        },
        getPercentages: function (){
            let allPerc = adatok.mindenAdat.exp.map(function(cur){
                return cur.getPercentage();
            });
            return allPerc;
        },

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
        budgetLabel: '.budget__value',
        incLabel: '.budget__income--value',
        expLabel: '.budget__expenses--value',
        percentage: '.budget__expenses--percentage',
        contener: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'

    };

    let formatNumber = function(num, type) {
        let numSplit,int,dec;
        num = Math.abs(num);
        num = num.toFixed(2);
        numSplit = num.split('.');
        int = numSplit[0];

        if (int.length > 3 ) {
            int= int.substr(0,int.length-3) + ',' + int.substr(int.length-3,int.length);
        }

        dec = numSplit[1];
        
        return (type ==='exp' ? '-':'+') + ' ' + int + '.' + dec;

         
    };

    let nodeListForEach = function(list,callback) {
        for (let i = 0; i <list.length;i++) {
            callback(list[i],i);
        }
    };


    
    return {
        getinput: function() {
            return {
                type : document.querySelector(DOMstrings.type).value,
                desc : document.querySelector(DOMstrings.desc).value,
                value : parseFloat(document.querySelector(DOMstrings.value).value),
            };
        },

        displayMonth: function () {
            let now,year,month;
            let monthNames = ["Január", "Február", "Március", "Április", "Május", "Junius",
            "Julius", "Augusztus", "Szeptember", "Oktober", "November", "December"];
            now = new Date();
            year = now.getFullYear();
            month = now.getMonth();
            document.querySelector(DOMstrings.dateLabel).textContent = year + " " + monthNames[month];
        },
        

        getDOMstrings: function() {
            return DOMstrings;
        },

        addListItem : function(obj,type) {
            //Create HTML string with placeholder
            let html,newHTML,element;

            if (type==='inc'){
                element = DOMstrings.incomeContainer;
                html= '<div class="item clearfix" id="inc-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type==='exp') {
                element = DOMstrings.expensContainer;
                html= '<div class="item clearfix" id="exp-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            //REpelace the placeholder text with actual data
            newHTML = html.replace('%id%',obj.id);
            newHTML = newHTML.replace('%desc%',obj.description);
            newHTML = newHTML.replace('%value%',formatNumber(obj.value,type));
            //insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend',newHTML);
            

        },

        deleteListItem : function (selectorId) {
            let selected;
            selected = document.getElementById(selectorId);
            selected.parentNode.removeChild(selected);
        },

        displayBudget : function(obj) {
            let type;
            obj.budget > 0 ? type = 'inc': type='exp';
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget,type);
            document.querySelector(DOMstrings.incLabel).textContent = formatNumber(obj.totalInc,'inc');
            document.querySelector(DOMstrings.expLabel).textContent = formatNumber(obj.totalExp,'exp');
            if(obj.percentage>0) {
                document.querySelector(DOMstrings.percentage).textContent = obj.percentage + '%';
            } else document.querySelector(DOMstrings.percentage).textContent = '---';

        },

        displayPercentages: function (percenteges) {
            let fields = document.querySelectorAll(DOMstrings.expensesPercLabel);


            
            nodeListForEach (fields, function(cur,index){
                if (percenteges[index]>0) {
                cur.textContent = percenteges[index] + '%';}
                else {
                    cur.textContent = '---';
                }
            });

        },

        changedType: function () {
            let filds = document.querySelectorAll(
                DOMstrings.type + ',' +
                DOMstrings.desc + ',' +
                DOMstrings.value);
            nodeListForEach(filds,function(cur){
                cur.classList.toggle('red-focus');
            });
            document.querySelector(DOMstrings.inputBtn).classList.toggle('red')

        },

        clearFilds: function(){
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

    let updateBudget = function() {

        koltsegController.calculateBudget();

        let budget = koltsegController.getBudget();

        uiController.displayBudget(budget);
    };


    let updatePerc = function() {
        koltsegController.calculatePercentages();
        let percentages = koltsegController.getPercentages();
        console.log(percentages);
        uiController.displayPercentages(percentages);
    };

    let setEvelisteners = function () {
        let DOM = uiCtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);
        document.addEventListener('keypress',function(event){
           if (event.keyCode===13 || event.which===13) {
               ctrlAddItem();
           } 
       
        });
        document.querySelector(DOM.contener).addEventListener('click',ctrlDeleteItem);
        document.querySelector(DOM.type).addEventListener('change',uiCtrl.changedType);
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
            updateBudget();
        //5. Frissiteni a százalékokat
            updatePerc(); 
        
    }
     
     
    };

    let ctrlDeleteItem = function(event) {
        let itemID,splitId,type,ID;
        itemID = (event.target.parentNode.parentNode.parentNode.parentNode.id);
        if (itemID) {
            splitId = itemID.split('-');
            type = splitId[0];
            ID = parseInt(splitId[1]);

            koltCtrl.deleteItem(type,ID);

            uiCtrl.deleteListItem(itemID);

            updateBudget();
            updatePerc();

        }
    };

    return {
        init:function(){  
            uiController.displayMonth();
            setEvelisteners();
            console.log('Application has started!');
            uiController.displayBudget({
                budget:0,
                totalInc :0,
                totalExp: 0,
                percentage: -1,
            });
        }
    };

})(koltsegController,uiController);
controller.init();
