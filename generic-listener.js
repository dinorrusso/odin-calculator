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