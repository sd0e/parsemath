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

const brackets = {
	"(": 1,
	")": -1,
	"[": 1,
	"]": -1
}

const isOperator = string => string in precedences;
const isInteger = string => /^\d+$/.test(string);
const isBracket = string => string in brackets ? [true, brackets[string]] : [false, 0];

const MAXIMUM_PRECEDENCE = 3;

const performCalculation = (number1, operator, number2 = 0) => {
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
		case 'sqrt':
			return Math.sqrt(number1)
	}

	return null;
}

const removeInnerBrackets = equation => {
	const equationValues = equation.split('');
	let previousBracketValue = 0;
	let maxDepth = -1;
	let firstBracketIdx = -1;
	let lastBracketIdx = -1;

	equationValues.forEach((equationValue, idx) => {
		const bracketValue = isBracket(equationValue);

		if (bracketValue[0]) {
			const currentValue = previousBracketValue + bracketValue[1];

			if (currentValue > maxDepth && lastBracketIdx === -1) {
				maxDepth = currentValue;
				firstBracketIdx = idx;
			} else if (previousBracketValue === maxDepth && currentValue < maxDepth && lastBracketIdx === -1) {
				lastBracketIdx = idx;
			}

			previousBracketValue = currentValue;
		}
	});

	const extractedEquation = equation.substring(firstBracketIdx + 1, lastBracketIdx);
	let extractedEquationResult = ParseMath(extractedEquation);

	let firstPart = equation.substring(0, firstBracketIdx);
	let lastPart = equation.substring(lastBracketIdx + 1, equation.length);

	if (isInteger(firstPart.charAt(firstPart.length - 1))) {
		// character before bracket is number, so implied multiplication
		firstPart += '*';
	} else if (firstPart.substring(firstPart.length - 4, firstPart.length) === 'sqrt') {
		// wants the content inside the bracket to be square rooted
		firstPart = firstPart.substring(0, firstPart.length - 4);
		extractedEquationResult = performCalculation(extractedEquationResult, 'sqrt');
	};

	if (isInteger(lastPart.charAt(0))) {
		// character after bracket is number, so implied multiplication
		lastPart = '*' + lastPart;
	}

	const fullResult = firstPart + extractedEquationResult + lastPart;

	return fullResult;
}

const containsBracket = equation => {
	let containsBracket = false;
	Object.keys(brackets).forEach(bracket => {
		if (equation.includes(bracket)) {
			containsBracket = true;
		}
	});

	return containsBracket;
}

// for example, equation is 5 * 6 / 7 + 8
export default function ParseMath(equation) {
	while (containsBracket(equation)) {
		equation = removeInnerBrackets(equation);
	}

	const equationValues = equation.split('');

	const numbers = new Stack();
	const operators = new Stack();
	const pendingNumbers = new Stack();

	equationValues.forEach((equationValue, idx) => {
		if (equationValue != ' ') {
			if (isOperator(equationValue)) {
				// part of equation is an operator
				operators.push(equationValue);
			} else if (isInteger(equationValue)) {
				// part of equation is an integer
				if (idx !== equation.length - 1 && (isInteger(equation.charAt(idx + 1)) || equation.charAt(idx + 1) === '.')) {
					// not end of equation string and next character is number or decimal point, so treat as one
					pendingNumbers.push(equationValue)
				} else if (idx !== 0 && (isInteger(equation.charAt(idx - 1)) || equation.charAt(idx - 1) === '.')) {
					// not start of equation string, next character is not number but previous number is
					pendingNumbers.push(equationValue);

					let resultingNumberString = '';
					while (!pendingNumbers.isEmpty()) {
						resultingNumberString += pendingNumbers.pop(0);
					}

					numbers.push(resultingNumberString);
				} else {
					numbers.push(equationValue);
				}
			} else if (equationValue === '.') {
				pendingNumbers.push('.');
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

		const resultingNumber = performCalculation(parseFloat(numbers.peek(operatorIndexes[0])), highestOperator, parseFloat(numbers.peek(operatorIndexes[1])));
		numbers.pop(operatorIndexes[1]);
		numbers.replace(operatorIndexes[0], resultingNumber.toString());
		operators.pop(highestOperatorIndex);
	}
	
	return numbers.pop();
}

// console.log(ParseMath('3.2^(9 * (8 + 3))'));
// console.log(ParseMath('3*6^2 - 5*6 + 3'));
// console.log(ParseMath('3(6)^2 - 5(6) + 3'));
// console.log(ParseMath('5 + sqrt(sqrt(5 * 6))'));