// savable variables
let purchasePrice = 0;
let downPaymentPercent = 0; // can be 3.5 or 20% etc.
let loanAmount = 0; 
let interestRate = 0; // can be 6.650 ect.
let loanTerm = 0; // can be 10, 15 or 30

let currentInput = '';
let lastOperation = '';
let storedValue = null;

let showingstoredValue = false;

const display = document.getElementById("display");
const numberShowing = document.getElementById("number-showing");
const deleteAllButton = document.getElementById("delete-all");
const deleteBackspaceButton = document.getElementById("delete-backspace");


function updateDisplay(value){
    if (!isNaN(value) && value !== '') { // if value is a number and not empty
        display.textContent = parseFloat(value).toLocaleString();
    } else { // if value is not a number
        display.textContent = value;
    }
}

function appendCharacter(char) {
    if (!isNaN(char) || (char === '.' && !currentInput.includes('.'))) {
        currentInput += char;
        updateDisplay(currentInput);
    }
}

function handleOperation(operation){
    const numValue = parseFloat(currentInput);
    
    if (!isNaN(numValue)) { // if numValue is a number
        if (storedValue === null) { // if storedValue is empty
            storedValue = numValue;
        } else if (lastOperation) { // if lastOperation is not empty
            calculate(numValue);
        }
    }

    switch (operation) {
        case "+":
        case "-":
        case "×":
        case "÷":
            lastOperation = operation;
            updateDisplay(storedValue + ' ' + lastOperation);
            appendCharacter(storedValue)
            break;
        case "=":
            calculate(numValue);
            lastOperation = '';
            break;
        case "AC":
            resetCalculator();
            break;
    }
    currentInput = '';

}

function calculate(numValue){
    if (lastOperation && !isNaN(numValue)) { // if lastOperation is not empty and numValue is a number
        switch (lastOperation) {
            case "+":
                storedValue += numValue;
                break;
            case "-":
                storedValue -= numValue;
                break;
            case "×":
                storedValue *= numValue;
                break;
            case "÷":
                storedValue /= numValue;
                break;
        }
        updateDisplay(storedValue);
        lastOperation = '';
    }
}

function backspace() {
    currentInput = currentInput.slice(0, -1);
    updateDisplay(currentInput);
}

function resetCalculator() {
    purchasePrice = 0;
    downPaymentPercent = 0;
    loanAmount = 0;
    interestRate = 0;
    loanTerm = 0;

    currentInput = '';
    lastOperation = '';
    storedValue = null;
    updateDisplay('0');
}

// Add event listeners to all buttons with the class "btn"
document.querySelectorAll(".btn").forEach(button => {
    button.addEventListener("click", function () {
        const value = this.textContent.trim(); // btn pressed

        if (!isNaN(value) || value === '.') { // if value is a number or a decimal
            appendCharacter(value);
        } else { // if value is an operation
            handleOperation(value);
        }
    });
});