function eval() {
    // Do not use eval!!!
    return;
}

const OPERATORS_WEIGHT = {
    '*': 2,
    '/': 2,
    '+': 1,
    '-': 1,
    '(': 0
}

const OPERATORS = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => {
      if (b === 0){
        throw Error("TypeError: Division by zero.");
      }
      return a / b;
    }
}

function expressionCalculator(expr) {
    let parsedArray = reversePolishNotation(expr);
    return calculate(parsedArray);
}

function reversePolishNotation(expr) {
    let inputString = expr.replace(/\s/g, '').split('');
    let inputArray = parseInputStringToArray(inputString);
    let opArray = [];
    let parsedArray = [];
    let curSymb = '';
    let brackets = [];

    while (inputArray.length) {
        curSymb = inputArray.shift();
        if (!isNaN(curSymb)) {
            parsedArray.push(curSymb);
        } else if (curSymb === '(') {
            opArray.push(curSymb);
            brackets.push('(');
        } else if (isNaN(curSymb) && curSymb !== ')') {
            if (opArray.length === 0 || checkPriority(curSymb, opArray[opArray.length - 1]) === 1) {
                opArray.push(curSymb);
            } else if (checkPriority(curSymb, opArray[opArray.length - 1]) === 0 ||
                checkPriority(curSymb, opArray[opArray.length - 1]) === -1){
                while (opArray.length > 0 && (checkPriority(curSymb, opArray[opArray.length - 1]) === 0 ||
                checkPriority(curSymb, opArray[opArray.length - 1]) === -1)) {
                    parsedArray.push(opArray.pop()); 
                }
                opArray.push(curSymb);
            }
        } else if (curSymb === ')') {
            if (brackets.length > 0) {
                brackets.pop()
            } else throw Error("ExpressionError: Brackets must be paired");
            while (opArray[opArray.length - 1] !== '(' && opArray.length > 0) {
                parsedArray.push(opArray.pop());
            }
            opArray.pop();
        };
    }
    while (opArray.length !== 0) {
        parsedArray.push(opArray.pop())
    }
    if (brackets.length > 0) throw Error("ExpressionError: Brackets must be paired");
    return parsedArray;
}

function calculate (parsedArray) {
    let operands = [];
    parsedArray.forEach(el => {
        if (!isNaN(el)) operands.push(el);
        if (isNaN(el)) {
            let b = operands.pop();
            let a = operands.pop();
            operands.push(OPERATORS[el](+a, +b));
        }
    })
    return operands[0];
}

function parseInputStringToArray (inputString) {
    let val = '';
    let resultArray = [];
    for (let i = 0; i < inputString.length; i++) {
        if(!isNaN(inputString[i])) {
            val += inputString[i];
            if (i === inputString.length - 1) resultArray.push(val);
        } else if (isNaN(inputString[i])) {
            if (val.length > 0) {
                resultArray.push(val);
                val = '';
            };
            resultArray.push(inputString[i]);
        }
    }
    return resultArray;
}

function checkPriority (curSymb, opArraySymbol) {
    if (OPERATORS_WEIGHT[curSymb] > OPERATORS_WEIGHT[opArraySymbol]) {
        return 1;
    } else if (OPERATORS_WEIGHT[curSymb] < OPERATORS_WEIGHT[opArraySymbol]) {
        return -1;
    } else {
        return 0;
    }
}

module.exports = {
    expressionCalculator
}