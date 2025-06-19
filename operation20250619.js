//saved before rewrite Thurs
const opsBtns = document.querySelectorAll(".operation-button");
opsBtns.forEach((btn) => {
  btn.addEventListener("click", function (event) {
    console.log(`in ops event ${event.target.textContent}`);
    log();
    let mode = calculator.state;
    let thisKey = event.target.textContent;
    console.log(`thisKey = ${thisKey}`);
    //see if we already have an operator
    if (calculator.operator === undefined){
        console.log('entering switch');
       
      if (calculator.lastKeyEntered !== '%'){
        calculator.operands[mode] = Number(calculator.inputBuffer[mode]);
      } // if % was lastKey then operand already set

      calculator.lastKeyEntered = thisKey;
      calculator.inputBuffer[mode] = calculator.inputBuffer[mode] + thisKey;
      switch (thisKey) {
        case ADDITION_SIGN:
          calculator.operator = add;
          break;
        case SUBTRACTION_SIGN:
          //TODO: need to add special case for minus sign!
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
      }
    calculator.state = OP2;
    }
    console.log('at end of operations event')
    log();
    refreshDisplay();
    event.stopImmediatePropagation(); //no need
  }); // end event listener function
}); //end forEach