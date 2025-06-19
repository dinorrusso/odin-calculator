//helper functions
function log() {
  //handy for debugging
  console.log(calculator);
}
//-------------------------------------------------------------
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
//-------------------------------------------------------------
function refreshDisplay() {
  display.textContent =
    calculator.inputBuffer[OP1] + calculator.inputBuffer[OP2];
}
//-------------------------------------------------------------
function calculatorReset(initValue) {
  display.textContent = initValue;
  calculator.state = OP1;
  calculator.operator = undefined;
  calculator.inputBuffer = [initValue, ""];
  calculator.operands = [undefined, undefined];
  calculator.lastKeyEntered = undefined;
}
//-------------------------------------------------------------
//event functions
function clearDisplay() {
  calculatorReset("0");
  refreshDisplay();
}
//-------------------------------------------------------------
//-------------------------------------------------------------
// simple math functions for assignment to calculator.operand
const add = (op1, op2) => op1 + op2;
const subtract = (op1, op2) => op1 - op2;
const multiply = (op1, op2) => op1 * op2;
const divide = (op1, op2) => (op2 === 0 ? "DIV by 0" : op1 / op2);
//-------------------------------------------------------------
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
const OP1 = 0; //working to get first operand
const OP2 = 1; // have first operand working to get second
//-------------------------------------------------------------
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
//-------------------------------------------------------------
//build the ui
const btnContainer = document.querySelector(".button-container");

//building a row at a time just because
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
  clearDisplay();
  event.stopImmediatePropagation(); //no need
}); // end event listener function
//----------------------------------------------------
//separate decimal button event listener due to logic
const decimalBtn = document.getElementById(".");
decimalBtn.addEventListener("click", function (event) {
  let mode = calculator.state;
  let thisKey = event.target.textContent;
  //make sure the input buffer does not have one already
  if (!calculator.inputBuffer[mode].includes(".")) {
    calculator.lastKeyEntered = thisKey;
    calculator.inputBuffer[mode] =
      calculator.inputBuffer[mode] + calculator.lastKeyEntered;
  } else {
    //swallow the decimal point - invalid
  }
  event.stopImmediatePropagation(); //no need
  refreshDisplay();
}); // end event listener function

//----------------------------------------------------
// sign button event listener
const signBtn = document.getElementById("sign");
signBtn.addEventListener("click", function (event) {
  let mode = calculator.state;
  //this is only valid if we have a number !== 0
  //take the input buffer content and multiply by -1
  //if result is positive, replace buffer content
  //if is negative enclose in () and replace buffer content
  //if input buffer is zero just ignore event
  if (calculator.lastKeyEntered !== "%") {
    let tempValue = Number(calculator.inputBuffer[mode]);
    tempValue = tempValue * -1;
    calculator.inputBuffer[mode] =
      tempValue < 0 ? `${tempValue}` : `${tempValue}`;
  } else {
    let tempValue = Number(calculator.inputBuffer[mode].slice(0, -1));
    tempValue = tempValue * -1;
    calculator.inputBuffer[mode] =
      tempValue < 0 ? `${tempValue}%` : `${tempValue}%`;
    //becuase % is special need to adjust operand as well
    calculator.operands[mode] = tempValue / 100;
  }
  refreshDisplay();
  event.stopImmediatePropagation(); //no need
}); // end event listener function
//-------------------------------------------------
const percentBtn = document.getElementById("percent");
percentBtn.addEventListener("click", function (event) {
  // just allow single % symbol per input buffer
  let thisKey = event.target.textContent;
  let mode = calculator.state;
  if (!calculator.inputBuffer[mode].includes(thisKey)) {
    //only 1 % allowed
    calculator.inputBuffer[mode] = calculator.inputBuffer[mode] + thisKey;
    calculator.operands[mode] =
      Number(calculator.inputBuffer[mode].slice(0, -1)) / 100; //this may not be a good idea
    calculator.lastKeyEntered = thisKey;
    refreshDisplay();
  }
  event.stopImmediatePropagation();
});
//----------------------------------------------------
// backspace button event listener
const backspaceBtn = document.getElementById("backspace");
backspaceBtn.addEventListener("click", function (event) {
  let mode = calculator.state;
  //operand 2 logic
  if (mode === OP2) {
    if (calculator.inputBuffer[mode].length > 0) {
      //delete  a character
      calculator.inputBuffer[mode] = calculator.inputBuffer[mode].slice(0, -1);
      if (calculator.inputBuffer[mode].length === 0) {
        calculator.lastKeyEntered = calculator.inputBuffer[OP1].slice(-1);
      } else {
        calculator.lastKeyEntered = calculator.inputBuffer[mode].slice(-1);
      }
    } else {
      //nothing to delete, need last char of OP1
      calculator.state = OP1;
      mode = calculator.state;
      //delete the operator
      calculator.inputBuffer[mode] = calculator.inputBuffer[mode].slice(0, -1);
      calculator.operator = undefined;
      calculator.lastKeyEntered = calculator.inputBuffer[mode].slice(-1);
    }
  } else {
    // mode === OP1
    if (calculator.inputBuffer[mode].length > 1) {
      //delete  a char
      calculator.inputBuffer[mode] = calculator.inputBuffer[mode].slice(0, -1);
      calculator.lastKeyEntered = calculator.inputBuffer[mode].slice(-1);
    } else {
      // same as a reset
      clearDisplay();
    }
  }

  refreshDisplay();
  event.stopImmediatePropagation();
});
//------------------------------------------------------------------------
//number buttons event listener - all numbers
const numberBtns = document.querySelectorAll(".numeric-button");
numberBtns.forEach((btn) => {
  btn.addEventListener("click", function (event) {
    let thisKey = event.target.textContent;

    let mode = calculator.state;
    if (calculator.lastKeyEntered === "=") {
      //we just did a total so we need to reset and replace previous value
      //with thisKey
      calculatorReset(thisKey);
    } else {
      calculator.inputBuffer[mode] =
        calculator.inputBuffer[mode] === "0"
          ? thisKey
          : calculator.inputBuffer[mode] + thisKey;
      calculator.lastKeyEntered = thisKey;
    }
    refreshDisplay();
  });
});
//----------------------------------------------------
//operation buttons event listener - all operations
const opsBtns = document.querySelectorAll(".operation-button");
opsBtns.forEach((btn) => {
  btn.addEventListener("click", function (event) {
    let thisKey = event.target.textContent;

    let mode = calculator.state;
    if (mode === OP1) {
      switch (thisKey) {
        case ADDITION_SIGN:
          calculator.operator = add;
          //this next statement is meant to protect against inputBuffer having a % symbol
          //the evaluation will already have the converted value - e.g. 5% will be 0.05 in operand
          if (calculator.lastKeyEntered !== "%") {
            calculator.operands[mode] = Number(calculator.inputBuffer[mode]);
          }
          calculator.inputBuffer[mode] = calculator.inputBuffer[mode] + thisKey;
          calculator.lastKeyEntered = thisKey;
          break;
        case SUBTRACTION_SIGN:
          //TODO: need to add special case for minus sign!
          calculator.operator = subtract;
          if (calculator.lastKeyEntered !== "%") {
            calculator.operands[mode] = Number(calculator.inputBuffer[mode]);
          }
          calculator.inputBuffer[mode] = calculator.inputBuffer[mode] + thisKey;
          calculator.lastKeyEntered = thisKey;
          break;
        case MULTIPLICATION_SIGN:
          calculator.operator = multiply;
          if (calculator.lastKeyEntered !== "%") {
            calculator.operands[mode] = Number(calculator.inputBuffer[mode]);
          }
          calculator.inputBuffer[mode] = calculator.inputBuffer[mode] + thisKey;
          calculator.lastKeyEntered = thisKey;
          break;
        case DIVISION_SIGN:
          calculator.operator = divide;
          if (calculator.lastKeyEntered !== "%") {
            calculator.operands[mode] = Number(calculator.inputBuffer[mode]);
          }
          calculator.inputBuffer[mode] = calculator.inputBuffer[mode] + thisKey;
          calculator.lastKeyEntered = thisKey;
          break;
        case TOTAL:
          //do nothing - only 1 operand
          break;
        default: //not an operator - process as normal
          console.log("should not have this happen!");
          break;
      }
      calculator.state = OP2;
    } else {
      //mode = OP2
      if (calculator.lastKeyEntered !== "%") {
        calculator.operands[mode] = Number(calculator.inputBuffer[mode]);
      }
      let result = calculator.operator(
        calculator.operands[OP1],
        calculator.operands[OP2]
      );
      if (result === "DIV by 0") {
        display.textContent = result;
        //disable all keys except AC
        // hide all buttons
        const allButtons = document.querySelector(".button-container");
        allButtons.style.display = "none";
        const resetMsg = document.querySelector(".reset-msg");
        resetMsg.textContent = "Reload page to reset calculator!";
        return;
      }
      calculator.operands[OP1] = result;
      calculator.operands[OP2] = undefined;
      calculator.inputBuffer[OP1] = "" + calculator.operands[OP1];
      calculator.inputBuffer[OP2] = "";
      calculator.lastKeyEntered = thisKey;

      if (thisKey === "=") {
        //did a total
        calculator.operator = undefined;
        calculator.state = OP1;
      } else {
        switch (thisKey) {
          case ADDITION_SIGN:
            calculator.operator = add;
            break;
          case SUBTRACTION_SIGN:
            calculator.operator = subtract;
            break;
          case MULTIPLICATION_SIGN:
            calculator.operator = multiply;
            break;
          case DIVISION_SIGN:
            calculator.operator = divide;
            break;
          default: //not an operator - process as normal
            console.log("should not have this happen!");
            break;
        } //end switch
        //add operator to the input buffer
        calculator.inputBuffer[OP1] = calculator.inputBuffer[OP1] + thisKey;
      } //end else key != '='
    }
    event.stopImmediatePropagation(); //no need
    refreshDisplay(); //end Op2
  }); // end event listener function
}); //end forEach
//----------------------------------------------------
//init the calculator
let calculator = {
  state: OP1,
  operator: undefined,
  lastKeyEntered: undefined,
  inputBuffer: ["0", ""],
  operands: [undefined, undefined],
};
//get a handle to the calculator display
const display = document.querySelector(".display");
refreshDisplay();
