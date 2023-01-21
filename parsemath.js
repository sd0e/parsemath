class Stack {
	constructor() {
		this.top = -1;
		this.bottom = 0;
		this.arr = [];
	}

	isEmpty() {
		return this.top === -1;
	}

	push(item) {
		this.arr.push(item);
		this.top++;
	}

	pop(idx = null) {
		if (!this.isEmpty()) {
			this.top--;
			if (idx === null) return this.arr.pop()
			else {
				const returnValue = this.arr[idx];
				this.arr.splice(idx, 1);
				return returnValue;
			};
		} else {
			return null;
		}
	}

	peek(idx = null) {
		if (!this.isEmpty()) {
			if (idx === null) return this.arr[this.top]
			else return this.arr[idx];
		} else {
			return null;
		}
	}

	replace(idx, newVal) {
		this.arr[idx] = newVal;
	}
}

// lower number means higher precendence
const precedences = {
	"^": 0,
	"*": 1,
	"/": 1,
	"+": 2,
	"-": 2
};

const isOperator = string => string in precedences;
const isInteger = string => /^\d+$/.test(string);

const MAXIMUM_PRECEDENCE = 3;

const performCalculation = (number1, number2, operator) => {
	switch (operator) {
		case '^':
			return number1**number2
		case '*':
			return number1*number2
		case '/':
			return number1/number2
		case '+':
			return number1+number2
		case '-':
			return number1-number2
	}

	return null;
}

// for example, equation is 5 * 6 / 7 + 8
export default function ParseMath(equation) {
	const equationValues = equation.split('');

	const numbers = new Stack();
	const operators = new Stack();

	equationValues.forEach(equationValue => {
		if (equationValue != ' ') {
			if (isOperator(equationValue)) {
				// part of equation is an operator
				operators.push(equationValue);
			} else if (isInteger(equationValue)) {
				// part of equation is an integer
				numbers.push(equationValue);
			}
		}
	});

	while (numbers.top !== 0) {
		let highestOperator = '+';
		let highestOperatorValue = MAXIMUM_PRECEDENCE;
		let highestOperatorIndex = -1;
		let operatorIndexes = [-1, -1];

		for (let idx = 0; idx <= operators.top; idx++) {
			const respectiveOperator = operators.peek(idx);
			const respectiveOperatorValue = precedences[respectiveOperator];

			if (respectiveOperatorValue < highestOperatorValue) {
				highestOperator = respectiveOperator;
				highestOperatorValue = respectiveOperatorValue;
				highestOperatorIndex = idx;
				operatorIndexes = [idx, idx + 1];
			}
		}

		const resultingNumber = performCalculation(parseFloat(numbers.peek(operatorIndexes[0])), parseFloat(numbers.peek(operatorIndexes[1])), highestOperator);
		numbers.pop(operatorIndexes[1]);
		numbers.replace(operatorIndexes[0], resultingNumber.toString());
		operators.pop(highestOperatorIndex);
	}
	
	return numbers.pop();
}

// console.log(ParseMath('3*6^2 - 5*6 + 3'));