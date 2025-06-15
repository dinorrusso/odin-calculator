//helper functions
function log() {
  console.log(
    `input buffer[0] = ${calculator.inputBuffer[0]}- input buffer[1] = ${calculator.inputBuffer[1]}`
  );
  console.log(calculator);
}
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function appendCharsWithDelay(div, initialText, newString, delayMs) {
  for (const char of newString) {
    initialText += char; // Append the new character
    div.textContent = initialText.slice(-15); // Update the div
    await wait(delayMs); // Wait for the specified delay
  }
}

function addButtons(btnArr) {
  const btnRow = document.createElement("div");
  btnRow.classList.add("button-row");
  btnArr.forEach((element) => {
    let btn = document.createElement("button");
    btn.classList.add("calculator-key", element.type);
    btn.id = element.id;
    btn.textContent = element.text;
    btnRow.appendChild(btn);
  });
  btnContainer.appendChild(btnRow);
}
function refreshDisplay() {
  display.textContent = calculator.inputBuffer[0] + calculator.inputBuffer[1];
}

function calculatorReset() {
  display.textContent = 0;
  calculator.state = OPERAND1_STATE;
  calculator.operand1 = undefined;
  calculator.operand2 = undefined;
  calculator.operator = undefined;
  calculator.inputBuffer = ["0", ""];
  calculator.lastKeyEntered = undefined;
  calculator.value = undefined;
}

//event functions
function clearDisplay() {
  const display = document.querySelector(".display");
  (calculator.inputBuffer = ["0"]), [""];
  refreshDisplay();
  log();
}
// simple math functions for total event
const add = (op1, op2) => op1 + op2;
const subtract = (op1, op2) => op1 - op2;
const multiply = (op1, op2) => op1 * op2;
const divide = (op1, op2) => (op2 === 0 ? "undefined" : op1 / op2);

//character symbol constants
const CHANGE_SIGN = "\u00B1";
const DIVISION_SIGN = "\u00F7";
const MULTIPLICATION_SIGN = "\u2715";
const SUBTRACTION_SIGN = "-";
const ADDITION_SIGN = "+";
const BACKSPACE_SYMBOL = "\u232B";
const PERCENT_SIGN = "%";
const TOTAL = "=";
const ALL_CLEAR = "AC";

//state constants

const OPERAND1_STATE = 0;
const OPERAND2_STATE = 1;
const TOTAL_STATE = "total";

// button data
const calcButtons = [
  [
    { type: "std-button", id: "ac", text: "AC", function: "clearDisplay" },
    {
      type: "std-button",
      id: "sign",
      text: CHANGE_SIGN,
      function: "changeSign",
    },
    {
      type: "std-button",
      id: "percent",
      text: PERCENT_SIGN,
      function: "percent",
    },
    {
      type: "operation-button",
      id: "divide",
      text: DIVISION_SIGN,
      function: "divide",
    },
  ],
  [
    { type: "numeric-button", id: "7", text: "7", function: "number" },
    { type: "numeric-button", id: "8", text: "8", function: "number" },
    { type: "numeric-button", id: "9", text: "9", function: "number" },
    {
      type: "operation-button",
      id: "multiply",
      text: MULTIPLICATION_SIGN,
      function: "multiply",
    },
  ],
  [
    { type: "numeric-button", id: "4", text: "4", function: "number" },
    { type: "numeric-button", id: "5", text: "5", function: "number" },
    { type: "numeric-button", id: "6", text: "6", function: "number" },
    {
      type: "operation-button",
      id: "subtract",
      text: SUBTRACTION_SIGN,
      function: "subtract",
    },
  ],
  [
    { type: "numeric-button", id: "1", text: "1", function: "number" },
    { type: "numeric-button", id: "2", text: "2", function: "number" },
    { type: "numeric-button", id: "3", text: "3", function: "number" },
    {
      type: "operation-button",
      id: "add",
      text: ADDITION_SIGN,
      function: "add",
    },
  ],
  [
    {
      type: "numeric-button",
      id: "backspace",
      text: BACKSPACE_SYMBOL,
      function: "backspace",
    },
    { type: "numeric-button", id: "0", text: "0", function: "number" },
    { type: "decimal-button", id: ".", text: ".", function: "decimal" },
    { type: "operation-button", id: "total", text: TOTAL, function: "total" },
  ],
];

//build the ui and assign event listeners
const btnContainer = document.querySelector(".button-container");

//building a row at a time
addButtons(calcButtons[0]);
addButtons(calcButtons[1]);
addButtons(calcButtons[2]);
addButtons(calcButtons[3]);
addButtons(calcButtons[4]);
////////////////////////////////////////////////
// EVENT LISTENERS
///////////////////////////////////////////////
//clear button event listener
const clearBtn = document.getElementById("ac");
clearBtn.addEventListener("click", function (event) {
  console.log(`in clear display event ${event}`);
  clearDisplay();
  calculatorReset();
  log();
  event.stopImmediatePropagation(); //no need
}); // end event listener function
//----------------------------------------------------
//separate decimal button event listener due to logic
const decimalBtn = document.getElementById(".");
decimalBtn.addEventListener("click", function (event) {
  console.log(`in decimal event ${event}`);
  let thisKey = event.target.textContent;
  //make sure the input buffer does not have one already
  console.log(
    `in decimal calculator.inputBuffer[0] =  = ${calculator.inputBuffer[0]}`
  );
  console.log(
    `in decimal calculator.inputBuffer[1] =  = ${calculator.inputBuffer[1]}`
  );
  if (calculator.inputBuffer.includes(".")) {
    //swallow the '.'
    event.stopImmediatePropagation(); //no need
    return;
  }
  calculator.lastKeyEntered = thisKey;
  if (calculator.state === OPERAND1_STATE) {
    calculator.inputBuffer[0] =
      calculator.inputBuffer[0] + calculator.lastKeyEntered;
  } else {
    calculator.inputBuffer[1] =
      calculator.inputBuffer[1] + calculator.lastKeyEntered;
  }

  event.stopImmediatePropagation(); //no need
  log();
  refreshDisplay();
}); // end event listener function

//----------------------------------------------------
// sign button event listener
const signBtn = document.getElementById("sign");
signBtn.addEventListener("click", function (event) {
  console.log(`in sign event ${event}`);
  let mode = calculator.state;
 
  //this is only valid if we have a number !== 0
  //take the input buffer content and multiply by -1
  //if result is positive, replace buffer content
  //if is negative enclose in () and replace buffer content
  //if input buffer is zero just ignore event
  let tempValue = Number(calculator.inputBuffer);
  tempValue = tempValue * -1;
  calculator.inputBuffer[mode] = tempValue < 0 ? `(${tempValue})` : tempValue;
  refreshDisplay();
  event.stopImmediatePropagation(); //no need
  log();
}); // end event listener function

//----------------------------------------------------
// total button event listener
const totalBtn = document.getElementById("total");
totalBtn.addEventListener("click", function (event) {
  //this should only work when we have operand1 and an operator
  console.log(`in total event ${event}`);
  let mode = calculator.state;
 
  if (calculator.operator === undefined) {
    return;
  }
  calculator.operand2 = Number(calculator.inputBuffer[mode]);

  let result = calculator.operator(calculator.operand1, calculator.operand2);
  
  
  if (result % 1 !== 0) {
    calculator.inputBuffer[mode] = result.toFixed(2);
  } else {
    calculator.inputBuffer[mode] = result;
  }
  calculator.state = OPERAND1_STATE;
  calculator.inputBuffer[OPERAND1_STATE] = calculator.inputBuffer[OPERAND2_STATE];
  calculator.inputBuffer[OPERAND2_STATE] = '';
  calculator.operand1 = Number(calculator.inputBuffer[OPERAND1_STATE]);
  calculator.operand2 = undefined;
  calculator.lastKeyEntered = undefined;
  calculator.operator = undefined;
  refreshDisplay();
  log();
  event.stopImmediatePropagation();
}); // end event listener function
//----------------------------------------------------
// backspace button event listener
const backspaceBtn = document.getElementById("backspace");
backspaceBtn.addEventListener("click", function (event) {
  console.log(`in backspace event ${event}`);
  let mode = calculator.state;
  
  if (calculator.inputBuffer.length > 1) {
    //see if input buffer is a signed number
    //if so, backspace should remove it
    //otherwise just delete the last digit
    if (calculator.inputBuffer[mode].includes("(-")) {
      calculator.inputBuffer[mode] = "0";
    } else {
      console.log(`the input buffer is ${calculator.inputBuffer}`);
      calculator.inputBuffer[mode] = calculator.inputBuffer[mode].slice(0, -1);

      console.log(
        `the input buffer after assignment is ${calculator.inputBuffer}`
      );
      // if lastKeyEntered was an operator then we need to reset
      const operations =
        ADDITION_SIGN + SUBTRACTION_SIGN + MULTIPLICATION_SIGN + DIVISION_SIGN;
      if (operations.includes(calculator.lastKeyEntered)) {
        //reset operator to undefined
        calculator.operator = undefined;
        //rest lastKeyEntered to previous last
        calculator.lastKeyEntered =
          calculator.inputBuffer[mode][calculator.inputBuffer[mode].length - 1];
      }
    }
  } else {
    //deleting last digit - need to reset
    calculatorReset();
  }

  // calculator.value = Number(calculator.inputBuffer);
  refreshDisplay();
  event.stopImmediatePropagation(); //no need
  log();
}); // end event listener function
//----------------------------------------------------
//number buttons event listener - all numbers
const numberBtns = document.querySelectorAll(".numeric-button");
numberBtns.forEach((btn) => {
  btn.addEventListener("click", function (event) {
    let mode = calculator.state;
    
    console.log(`in number event ${event.target.textContent}`);
    let thisKey = event.target.textContent;
    console.log(`thisKey = ${thisKey}`);
    log();
    calculator.inputBuffer[mode] =
      calculator.inputBuffer[mode] === "0"
        ? thisKey
        : calculator.inputBuffer[mode] + thisKey;
    calculator.lastKeyEntered = thisKey;
    refreshDisplay();
    log();
  });
});
//removed generic listener
//----------------------------------------------------
//operation buttons event listener - all operations
const opsBtns = document.querySelectorAll(".operation-button");
opsBtns.forEach((btn) => {
  btn.addEventListener("click", function (event) {
    let mode = calculator.state;
    
    let thisKey = event.target.textContent;
    console.log(`thisKey = ${thisKey}`);

    //if there is already a operator TODO then we have an implied total...
    if (calculator.operator) {
      //implied total logic needs to go here
    } else {
      switch (thisKey) {
        case ADDITION_SIGN:
          calculator.operand1 = Number(calculator.inputBuffer[mode]);
          calculator.operator = add;
          calculator.inputBuffer[mode] = calculator.inputBuffer[mode] + thisKey;
          break;
        case SUBTRACTION_SIGN:
          //need to add special case for minus sign!
          calculator.operand1 = Number(calculator.inputBuffer[mode]);
          calculator.operator = subtract;
          calculator.inputBuffer[mode] = calculator.inputBuffer[mode] + thisKey;
          break;
        case MULTIPLICATION_SIGN:
          calculator.operand1 = Number(calculator.inputBuffer[mode]);
          calculator.operator = multiply;
          calculator.inputBuffer[mode] = calculator.inputBuffer[mode] + thisKey;
          break;
        case DIVISION_SIGN:
          calculator.operand1 = Number(calculator.inputBuffer[mode]);
          calculator.operator = divide;
          calculator.inputBuffer[mode] = calculator.inputBuffer[mode] + thisKey;
          break;
        default: //not an operator - process as normal
          console.log("should not have this happen!");
          break;
      }
    }
    calculator.state = OPERAND2_STATE;
    

    log();
    refreshDisplay();
    event.stopImmediatePropagation(); //no need
  }); // end event listener function
}); //end forEach
//----------------------------------------------------
//init the calculator
let calculator = {
  state: OPERAND1_STATE,
  operand1: 0,
  operand2: undefined,
  operator: undefined,
  lastKeyEntered: undefined,
  inputBuffer: ["0", ""],
  value: 0,
};
const display = document.querySelector(".display");
log();
refreshDisplay();
