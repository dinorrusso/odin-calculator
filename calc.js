//helper functions
function log(){
    console.log(`input buffer = ${calculator.inputBuffer}`);
    console.log(calculator);
}
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function appendCharsWithDelay(div, initialText, newString, delayMs) {
  for (const char of newString) {
    initialText += char; // Append the new character
    div.textContent = initialText.slice(-15); // Update the div
    await wait(delayMs); // Wait for the specified delay
  }
}

function addButtons(btnArr){
    const btnRow = document.createElement("div");
    btnRow.classList.add("button-row")
    btnArr.forEach(element => {
        let btn = document.createElement('button');
        btn.classList.add('calculator-key', element.type);
        btn.id = element.id;
        btn.textContent = element.text;
        btnRow.appendChild(btn)
    });
    btnContainer.appendChild(btnRow);
}
function refreshDisplay(){
    display.textContent = calculator.inputBuffer;
}

function calculatorReset(){
    display.textContent = 0;
    calculator.operand1 = undefined;
    calculator.operand2 = undefined;
    calculator.operator = undefined;
    calculator.inputBuffer ='0';
    calculator.lastKeyEntered = undefined;
    calculator.value = 0;
}

//event functions
function clearDisplay(){
    const display = document.querySelector(".display");
    calculator.inputBuffer ='0';
    refreshDisplay();
}
// simple math functions for total event
const add = (op1, op2) => op1 + op2;
const subtract = (op1, op2) => op1 - op2;
const multiply = (op1, op2) =>  op1*op2;
const divide = (op1, op2) =>  op2 === 0 ? 'undefined' : op1 / op2;

//character symbol constants
const CHANGE_SIGN = '\u00B1';
const DIVISION_SIGN = '\u00F7';
const MULTIPLICATION_SIGN = '\u2715';
const SUBTRACTION_SIGN = '-';
const ADDITION_SIGN = '+';
const BACKSPACE_SYMBOL = '\u232B'
const PERCENT_SIGN = '%';
const TOTAL = '=';
const ALL_CLEAR = 'AC';

// button data
const calcButtons = [
[   {type: 'std-button', id: 'ac', text: 'AC', function: 'clearDisplay' },
    {type: 'std-button', id: 'sign', text: CHANGE_SIGN, function: 'changeSign' },
    {type: 'std-button', id: 'percent', text: PERCENT_SIGN, function: 'percent'},
    {type: 'operation-button', id: 'divide', text: DIVISION_SIGN, function: 'divide'}],
[   {type: 'numeric-button', id: '7', text: '7', function: 'number' },
    {type: 'numeric-button', id: '8', text: '8', function: 'number' },
    {type: 'numeric-button', id: '9', text: '9', function: 'number' },
    {type: 'operation-button', id: 'multiply', text: MULTIPLICATION_SIGN, function: 'multiply' }
],
[   {type: 'numeric-button', id: '4', text: '4', function: 'number' },
    {type: 'numeric-button', id: '5', text: '5', function: 'number' },
    {type: 'numeric-button', id: '6', text: '6', function: 'number' },
    {type: 'operation-button', id: 'subtract', text: SUBTRACTION_SIGN, function: 'subtract' }
],
[   {type: 'numeric-button', id: '1', text: '1', function: 'number' },
    {type: 'numeric-button', id: '2', text: '2', function: 'number' },
    {type: 'numeric-button', id: '3', text: '3', function: 'number' },
    {type: 'operation-button', id: 'add', text: ADDITION_SIGN, function: 'add' }
],
[   {type: 'numeric-button', id: 'backspace', text: BACKSPACE_SYMBOL, function: 'backspace' },
    {type: 'numeric-button', id: '0', text: '0', function: 'number' },
    {type: 'numeric-button', id: '.', text: '.', function: 'decimal' },
    {type: 'operation-button', id: 'total', text: TOTAL, function: 'total' }
]
]

//build the ui and assign event listeners
const btnContainer = document.querySelector(".button-container");

//building a row at a time
addButtons(calcButtons[0]);
addButtons(calcButtons[1]);
addButtons(calcButtons[2]);
addButtons(calcButtons[3]);
addButtons(calcButtons[4]);

//clear button event listener
const clearBtn = document.getElementById('ac');
clearBtn.addEventListener("click", function (event) {
    console.log(`in clear display event ${event}`);
    clearDisplay();
    calculatorReset();
    log();
    event.stopImmediatePropagation();  //no need
    });// end event listener function

// sign button event listener
const signBtn = document.getElementById('sign');
signBtn.addEventListener("click", function (event) {
    console.log(`in sign event ${event}`);

    //this is only valid if we have a number !== 0
    //take the input buffer content and multiply by -1
    //if result is positive, replace buffer content
    //if is negative enclose in () and replace buffer content
    //if input buffer is zero just ignore event
    calculator.value = calculator.value * -1;
    if (calculator.value < 0 ){
        calculator.inputBuffer = `(${calculator.value})`}
        else
        { calculator.inputBuffer = calculator.value}
    refreshDisplay();
    event.stopImmediatePropagation();  //no need
    log();
    });// end event listener function



// total button event listener
const totalBtn = document.getElementById('total');
totalBtn.addEventListener("click", function (event) {
    //this should only work when we have operand1 and an operator

    calculator.value = calculator.operator(calculator.operand1, calculator.operand2);
    console.log(`in total event ${event}`);
    event.stopImmediatePropagation();
    log();  //no 
    if (calculator.value %1 !== 0){
        calculator.inputBuffer = calculator.value.toFixed(2);
    }else{
        calculator.inputBuffer = calculator.value;
    }
    
    refreshDisplay();
    });// end event listener function

// backspace button event listener
const backspaceBtn = document.getElementById('backspace');
backspaceBtn.addEventListener("click", function (event) {
    console.log(`in backspace event ${event}`);
    if (calculator.inputBuffer.length > 1){
        //see if input buffer is a signed number
        //if so, backspace should remove it
        //otherwise just delete the last digit
        if(calculator.inputBuffer.includes('(-')){
            calculator.inputBuffer = '0';}
            else{
                calculator.inputBuffer = calculator.inputBuffer.slice(0,-1);
                // if lastKeyEntered was an operator then we need to reset 
                const operations = ADDITION_SIGN + SUBTRACTION_SIGN + MULTIPLICATION_SIGN + DIVISION_SIGN;
                if(operations.includes(calculator.lastKeyEntered)){
                    //reset operator to undefined
                    calculator.operator = undefined;
                    //rest lastKeyEntered to previous last
                    calculator.lastKeyEntered = calculator.inputBuffer[calculator.inputBuffer.length - 1];
                }
            }
        }
    calculator.value = Number(calculator.inputBuffer);
    refreshDisplay();
    event.stopImmediatePropagation(); //no need
    log();  
    });// end event listener function

//generic key pressed listener
const keys = document.querySelectorAll(".calculator-key");
keys.forEach((key) => {
    key.addEventListener("click",function (event) {
        console.log(event);
        console.log(`in key event ${event.target.textContent}`);
        let thisKey = event.target.textContent;
        //before adding entered key to buffer, make sure it is valid
        if(thisKey === '.'){
            //make sure the input buffer does not have one already
            if(calculator.inputBuffer.includes('.')){
                //swallow the '.'
                thisKey = '';
            }
        }
        //if it is the first number key pressed, swallow/replace the leading zero
        if(calculator.inputBuffer === '0'  || calculator.inputBuffer === 'undefined' ){
            calculator.inputBuffer = '';
        }
        

        calculator.lastKeyEntered = thisKey;
        //if it is an operation...
        //if there is already a operator, we cannot have another
        if (calculator.operator){
            //already have an operator - do nothing 
        }else{
            switch (thisKey) {
            case ADDITION_SIGN:
                calculator.operand1 = calculator.value;
                calculator.operator = add;
                calculator.inputBuffer = calculator.inputBuffer + calculator.lastKeyEntered;
                break;
            case SUBTRACTION_SIGN:
                calculator.operand1 = calculator.value;
                calculator.operator = subtract;
                calculator.inputBuffer = calculator.inputBuffer + calculator.lastKeyEntered;
                break;
            case MULTIPLICATION_SIGN:
                calculator.operand1 = calculator.value;
                calculator.operator = multiply;
                calculator.inputBuffer = calculator.inputBuffer + calculator.lastKeyEntered;
                break;
            case DIVISION_SIGN:
                calculator.operand1 = calculator.value;
                calculator.operator = divide;
                calculator.inputBuffer = calculator.inputBuffer + calculator.lastKeyEntered;
                break;
            default:  //not an operator - process as normal
                calculator.inputBuffer = calculator.inputBuffer + calculator.lastKeyEntered;
                calculator.value = Number(calculator.inputBuffer);
                break;  
            }
        }
        log();
        refreshDisplay();
        });// end event listener function
    });//end forEach

//init the calculator
let  calculator = {
    operand1: undefined,
    operand2: undefined,
    operator: undefined,
    lastKeyEntered: undefined,
    inputBuffer: '0',
    value: 0,
};
const display = document.querySelector(".display");
refreshDisplay();
// console.log(display.textContent);
// clearDisplay();
// let displayText = '1234567890.987654321';
// appendCharsWithDelay(display, "", displayText, 50)
// console.log(display.textContent);
// calculator.operand1 = 0;
// log();
    // display.textContent = 0;
    // calculator.operand1 = undefined;
    // calculator.operand2 = undefined;
    // calculator.operator = undefined;
    // calculator.inputBuffer ='0';
    // calculator.lastKeyEntered = undefined;
    // calculator.value = 0;
/* I am stuck...
 I need to figure out how I switch to collecting operand two and yet keep diplaying
 the input until total is hit

*/