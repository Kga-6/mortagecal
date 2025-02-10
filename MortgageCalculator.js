let purchasePrice = 0;
let downPaymentPercent = 0;
let loanAmount = 0;
let interestRate = 0;
let loanTerm = 0;
let currentInput = '';
let lastOperation = '';
let storedValue = null;

const display = document.getElementById("display");
const numberShowing = document.getElementById("number-showing");
const deleteAllButton = document.getElementById("delete-all");
const deleteBackspaceButton = document.getElementById("delete-backspace");
let showingNumber = false;

/**
 * Updates the display with the given value.
 * @param {string|number} value - The value to display.
 */
function updateDisplay(value) {
    if (!isNaN(value) && value !== '') {
        display.textContent = parseFloat(value).toLocaleString();
    } else {
        display.textContent = value;
    }

    numberShowing.style.display = "none";
    showingNumber = false;

   
    // if (value === "0") {
    //     console.log("AC");
    //     deleteAllButton.style.display = "block";
    //     deleteBackspaceButton.style.display = "none";
    // } else {
    //     console.log("Backspace");
    //     deleteBackspaceButton.style.display = "block";
    //     deleteAllButton.style.display = "none";
    // }
}

// Add event listeners to all buttons with the class "btn"
document.querySelectorAll(".btn").forEach(button => {
    button.addEventListener("click", function () {
        const value = this.textContent.trim();
        if (!isNaN(value) || value === '.') {
            currentInput += value;
            updateDisplay(currentInput);
        } else {
            handleOperation(value);
        }
    });
});

/**
 * Handles the given operation.
 * @param {string} operation - The operation to handle.
 */
function handleOperation(operation) {
    const numValue = parseFloat(currentInput);
    
    if (!isNaN(numValue)) {
        if (storedValue === null) {
            storedValue = numValue;
        } else if (lastOperation) {
            calculateResult(numValue);
        }
    }

    switch (operation) {
        case "Price":
            if (showingNumber == false) {
                purchasePrice = numValue;
                numberShowing.textContent = "HOME PRICE";
                console.log("purchase price set: " + "$" + purchasePrice);
                numberShowing.style.display = "block";
                showingNumber = true;
                updateDisplay(purchasePrice);
            }else{
                numberShowing.textContent = "HOME PRICE";
                numberShowing.style.display = "block";
                showingNumber = true;
                updateDisplay(purchasePrice);
            }
            break;
        case "%":
            downPaymentPercent = numValue / 100;
            let downPayment = purchasePrice * downPaymentPercent;
            updateDisplay(downPayment.toFixed(2));
            break;
        case "Loan Amt":
            loanAmount = purchasePrice - (purchasePrice * downPaymentPercent);
            numberShowing.textContent = "LOAN AMOUNT";
            numberShowing.style.display = "block";
            showingNumber = true;
            updateDisplay(loanAmount);
            break;
        case "Int":
            if (showingNumber == false) {
                interestRate = numValue / 100;
                numberShowing.textContent = "ANNUAL INTEREST %";
                numberShowing.style.display = "block";
                showingNumber = true;
                updateDisplay(interestRate * 100);
            }else{
                numberShowing.textContent = "ANNUAL INTEREST %";
                numberShowing.style.display = "block";
                showingNumber = true;
                updateDisplay(interestRate * 100);
            }
            break;
        case "Term":
            if (showingNumber == false) {
                loanTerm = numValue;
                numberShowing.textContent = "ANNUAL TERM";
                numberShowing.style.display = "block";
                showingNumber = true;
                updateDisplay(loanTerm);
            }else{
                numberShowing.textContent = "ANNUAL TERM";
                numberShowing.style.display = "block";
                showingNumber = true;
                updateDisplay(loanTerm);
            }
            break;
        case "Pmt":
            if (loanAmount > 0 && interestRate > 0 && loanTerm > 0) {
                let monthlyRate = interestRate / 12;
                let numPayments = loanTerm * 12;
                let monthlyPayment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numPayments));
                numberShowing.textContent = "P&I PAYMENT";
                numberShowing.style.display = "block";
                showingNumber = true;
                updateDisplay(monthlyPayment.toFixed(2));
            }
            break;
        case "+":
        case "-":
        case "×":
        case "÷":
            lastOperation = operation;
            updateDisplay(storedValue + ' ' + lastOperation);
            break;
        case "=":
            calculateResult(numValue);
            lastOperation = '';
            break;
        case "AC":
            resetCalculator();
            break;
    }
    currentInput = '';
}

function calculateResult(numValue) {
    if (lastOperation && !isNaN(numValue)) {
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

function resetCalculator() {
    numberShowing.style.display = "none";
    showingNumber = false;
    purchasePrice = 0;
    downPaymentPercent = 0;
    loanAmount = 0;
    interestRate = 0;
    loanTerm = 0;
    storedValue = null;
    currentInput = '';
    lastOperation = '';
    numberShowing.textContent = "LOAN AMOUNT";
    updateDisplay("0");
}
