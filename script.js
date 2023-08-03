class Calculator {
	constructor(previousOperandTextElement, currentOperandTextElement) {
		this.previousOperandTextElement = previousOperandTextElement;
		this.currentOperandTextElement = currentOperandTextElement;
		this.currentOperandTextElement.innerText = '0';
		this.clear();
	}

	clear() {
		this.currentOperand = '0';
		this.previousOperand = '';
		this.operation = undefined;
	}

	delete() {
		if (this.currentOperand == 'Cannot divide by zero!') return;
		this.currentOperand = this.currentOperand.toString().slice(0, -1);
		if (this.currentOperand === '') {
			this.currentOperand = '0';
		}
	}

	appendNumber(number) {
		if (number == '.' && this.currentOperand.toString().includes('.')) return;
		if (this.currentOperand == 'Cannot divide by zero!') return;
		this.currentOperand = this.currentOperand.toString() + number.toString();
	}

	chooseOperation(operation) {
		if (this.currentOperand == 'Cannot divide by zero!') return;
		this.operation = operation;
		if (this.currentOperand !== '') {
			this.previousOperand = this.currentOperand;
			this.currentOperand = '';
		}
		this.compute();
	}

	compute() {
		let computation;
		const prev = parseFloat(this.previousOperand);
		const current = parseFloat(this.currentOperand);
		if (isNaN(prev) || isNaN(current)) return;
		switch (this.operation) {
			case '+':
				computation = prev + current;
				break;
			case '-':
				computation = prev - current;
				break;
			case '*':
				computation = prev * current;
				break;
			case '÷':
				if (current == '0') {
					computation = 'Cannot divide by zero!';
				} else {
					computation = prev / current;
				}
				break;
			default:
				return;
		}
		if (computation == 'Cannot divide by zero!') {
			this.currentOperand = computation;
		} else {
			this.currentOperand = this.getRoundedFloatResult(computation);
		}
		this.operation = undefined;
		this.previousOperand = '';
	}

	getRoundedFloatResult(result) {
		return Math.round(parseFloat(result) * Math.pow(10, 10)) / Math.pow(10, 10);
	}

	getDisplayNumber(number) {
		const stringNumber = number.toString();
		const integerDigits = parseFloat(stringNumber.split('.')[0]);
		const decimalDigits = stringNumber.split('.')[1];
		let integerDisplay;

		if (isNaN(integerDigits)) {
			integerDisplay = '';
		} else {
			integerDisplay = integerDigits.toLocaleString('en', {
				maximumFractionDigits: 0
			});
		}
		if (decimalDigits != null) {
			return `${integerDisplay}.${decimalDigits}`;
		} else {
			return integerDisplay;
		}
	}

	updateDisplay() {
		if (this.currentOperand == 'Cannot divide by zero!') {
			this.currentOperandTextElement.innerText = 'Cannot divide by zero!';
			return;
		}
		this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
		if (this.operation != undefined) {
			this.previousOperandTextElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${
				this.operation
			}`;
		} else {
			this.previousOperandTextElement.innerText = '';
		}
	}
}

const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]');
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

numberButtons.forEach((button) => {
	button.addEventListener('click', () => {
		calculator.appendNumber(button.innerText);
		calculator.updateDisplay();
	});
});

operationButtons.forEach((button) => {
	button.addEventListener('click', () => {
		calculator.chooseOperation(button.innerText);
		calculator.updateDisplay();
	});
});

equalsButton.addEventListener('click', (button) => {
	calculator.compute();
	calculator.updateDisplay();
});

allClearButton.addEventListener('click', (button) => {
	calculator.clear();
	calculator.updateDisplay();
});

deleteButton.addEventListener('click', (button) => {
	calculator.delete();
	calculator.updateDisplay();
});
