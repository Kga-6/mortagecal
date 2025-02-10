// Savable variables
let purchasePrice = 0;
let downPayment = 0; // Can be 3.5% or 20%, etc.
let loanAmount = 0;
let interestRate = 0; // Can be 6.650, etc.
let loanTerm = 0; // Can be 10, 15, or 30

let currentInput = ''; // Ensure it's always a string
let storedValue = null;

let showingNumber = false;

const display = document.getElementById("display");
const numberShowing = document.getElementById("number-showing");

// Function to update display
function updateDisplay(value) {
    if (!isNaN(value) && value !== '') { // If value is a number and not empty
        display.textContent = parseFloat(value).toLocaleString();
    } else { // If value is not a number
        display.textContent = value;
    }
}

// Append character (numbers/operators)
function appendCharacter2(char) {
    currentInput = String(currentInput); // Ensure currentInput is a string

    // Prevent consecutive operators (e.g., "3++3")
    if (["+", "-", "*", "/"].includes(char) && ["+", "-", "*", "/"].includes(currentInput.slice(-1))) {
        return;
    }

    // Allow decimals after an operator
    if (char === '.' && (currentInput === '' || ["+", "-", "*", "/"].includes(currentInput.slice(-1)))) {
        char = '0.'; // Ensure correct decimal formatting
    }

    // Replace symbols for eval()
    if (char === "×") char = "*";
    if (char === "÷") char = "/";

    currentInput += char;
    updateDisplay(currentInput);
}

function appendCharacter(char) {
    currentInput = String(currentInput); // Ensure currentInput is a string

    // Prevent consecutive operators (e.g., "3++3")
    if (["+", "-", "*", "/", "×", "÷"].includes(char) && ["+", "-", "*", "/", "×", "÷"].includes(currentInput.slice(-1))) {
        return;
    }

    // Allow decimals after an operator (e.g., "3+" => "3+0.")
    if (char === '.' && (currentInput === '' || ["+", "-", "*", "/", "×", "÷"].includes(currentInput.slice(-1)))) {
        char = '0.'; // Ensure correct decimal formatting
    }

    // Replace symbols for eval()
    if (char === "×") char = "*";
    if (char === "÷") char = "/";

    // Append the character to currentInput
    currentInput += char;

    // **Apply 2 decimal formatting only when an operator is involved**
    if (["+", "-", "*", "/"].includes(char)) {
        let parts = currentInput.split(/([\+\-\*\/])/); // Split while keeping operators
        
        let formattedParts = parts.map((part, index) => {
            let num = parseFloat(part); // Convert to number
            if (!isNaN(num)) {
                return num % 1 === 0 ? num.toFixed(0) : num.toFixed(2); // Remove .00 for whole numbers
            }
            return part; // Keep operators unchanged
        });
    
        // Reassemble the expression with formatting applied
        currentInput = formattedParts.join('');
    }
    

    updateDisplay(currentInput);
}



// Handle operations
function handleOperation(operation) {
    const numValue = parseFloat(currentInput) || 0;

    switch (operation) {
        case "$":
            numberShowing.textContent = "HOME PRICE";
            numberShowing.style.display = "block";
            if (!showingNumber) {
                purchasePrice = numValue;
                updateDisplay(purchasePrice);
            }
            showingNumber = true;
            break;

        case "%":
            break;

        case "Loan Amt":
            numberShowing.textContent = "LOAN AMOUNT";
            numberShowing.style.display = "block";
            if (!showingNumber) {
                console.log(purchasePrice);
                loanAmount = purchasePrice - numValue;
                downPayment = numValue;
                console.log(loanAmount);
                updateDisplay(loanAmount);
            }
            showingNumber = true;
            currentInput = '';
            break;

        case "Int":
            numberShowing.textContent = "ANNUAL INTEREST %";
            numberShowing.style.display = "block";
            if (!showingNumber) {
                interestRate = numValue;
                updateDisplay(interestRate);
            }
            currentInput = '';
            break;

        case "Term":
            numberShowing.textContent = "ANNUAL TERM";
            numberShowing.style.display = "block";
            if (!showingNumber) {
                loanTerm = numValue;
                updateDisplay(loanTerm);
            }
            currentInput = '';
            break;

        case "Pmt":
            numberShowing.textContent = "P&I PAYMENT";
            numberShowing.style.display = "block";
            if (!showingNumber) {
                if (loanAmount > 0 && interestRate > 0 && loanTerm > 0) {
                    let monthlyRate = (interestRate / 100) / 12; // Convert to decimal
                    let numPayments = loanTerm * 12;
                    let monthlyPayment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numPayments));

                    updateDisplay(monthlyPayment.toFixed(2));
                    currentInput = String(monthlyPayment); // Ensure it's a string
                }
            }
            break;

        case "=":
            calculateResult();
            break;

        case "AC":
            resetCalculator();
            break;
    }
}

// Evaluate expression safely
function calculateResult() {
    try {
        currentInput = String(currentInput); // Ensure it's a string before replacing anything

        // Convert "3.5%" to "3.5/100"
        let expression = currentInput.replace(/(\d+(\.\d+)?)%/g, "($1/100)");

        let result = eval(expression); // Evaluate the fixed expression
        currentInput = String(result); // Ensure it's a string after calculation
        updateDisplay(result);
    } catch (error) {
        updateDisplay("0");
    }
}

// Reset calculator
function resetCalculator() {
    purchasePrice = 0;
    downPayment = 0;
    loanAmount = 0;
    interestRate = 0;
    loanTerm = 0;

    currentInput = ''; // Reset as a string
    storedValue = null;

    updateDisplay('0');
}

// Listener for "Print" button (Debugging)
document.getElementById("print").addEventListener("click", function () {
    console.log("Purchase Price: " + purchasePrice);
    console.log("Downpayment: " + downPayment);
    console.log("Loan Amount: " + loanAmount);
    console.log("Interest Rate: " + interestRate);
    console.log("Loan Term: " + loanTerm);
    console.log("----------------------")
});

// Button event listeners
document.querySelectorAll(".btn").forEach(button => {
    button.addEventListener("click", function () {
        const value = this.textContent.trim(); // Button pressed

        numberShowing.style.display = "none";
        showingNumber = false;

        if (!isNaN(value) || value === '.' || value === "+" || value === "-" || value === "×" || value === "÷" || value === "%") {
            appendCharacter(value);
        } else { // If value is an operation
            handleOperation(value);
        }
    });
});
