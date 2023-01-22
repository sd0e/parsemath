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
const isLetter = string => /[a-zA-Zα-ωΑ-Ω]/.test(string);
const isBracket = string => string in brackets ? [true, brackets[string]] : [false, 0];

const MAXIMUM_PRECEDENCE = 3;
const CONSTANTS = {
	"e": Math.E,
	"π": Math.PI,
}
let VARIABLES = CONSTANTS;

const OPERATORS = {
	"^": (number1, number2) => number1**number2,
	"*": (number1, number2) => number1*number2,
	"/": (number1, number2) => number1/number2,
	"+": (number1, number2) => number1+number2,
	"-": (number1, number2) => number1-number2,
	"sqrt": (number1, _) => Math.sqrt(number1),
	"sin": (number1, _) => Math.sin(number1),
	"cos": (number1, _) => Math.cos(number1),
	"tan": (number1, _) => Math.tan(number1),
	"asin": (number1, _) => Math.asin(number1),
	"acos": (number1, _) => Math.acos(number1),
	"atan": (number1, _) => Math.atan(number1),
	"arcsin": (number1, _) => Math.asin(number1),
	"arccos": (number1, _) => Math.acos(number1),
	"arctan": (number1, _) => Math.atan(number1),
}

const performCalculation = (number1, operator, number2 = 0) => {
	operator = operator.toLowerCase();
	if (operator in OPERATORS) return OPERATORS[operator](number1, number2)
	else return null;
}

// returns `false` if last letter is not letter, otherwise it returns all final of letters of string
const containsFinalString = firstPart => {
	const finalCharacter = firstPart.charAt(firstPart.length - 1);
	if (!isLetter(finalCharacter)) {
		return false;
	} else {
		if (firstPart.length === 1) {
			return finalCharacter;
		} else {
			let returnString = finalCharacter;
			let characterIsLetter = true;
			let currentSearchIndex = firstPart.length - 2

			while (characterIsLetter) {
				if (isLetter(firstPart.charAt(currentSearchIndex))) {
					returnString = firstPart.charAt(currentSearchIndex) + returnString;

					if (firstPart.length - 1 === currentSearchIndex) {
						// reached start of string, return
						return returnString;
					} else {
						currentSearchIndex--;
					}
				} else {
					characterIsLetter = false;
				}
			}

			return returnString;
		}
	}
}

const letterIsPartOfFunction = (string, idx) => {
	const originalIdx = idx;

	let prevIsLetter = true;
	let bracketFound = false;
	let functionString = string.charAt(idx);

	while (prevIsLetter && idx < string.length - 1) {
		idx += 1;
		if (!isLetter(string.charAt(idx))) {
			prevIsLetter = false;
			if (isBracket(string.charAt(idx))[0]) {
				bracketFound = true;
			} else return false
		} else {
			functionString += string.charAt(idx);
		}
	}

	let nextIsLetter = true;
	bracketFound = false;
	idx = originalIdx;

	while (nextIsLetter && idx > 0) {
		idx -= 1;
		if (!isLetter(string.charAt(idx))) {
			nextIsLetter = false;
		} else {
			functionString = string.charAt(idx) + functionString;
		}
	}

	if (!(functionString.toLowerCase() in OPERATORS)) {
		// not an operator
		return false
	} else {
		return true
	}
}

const removeInnerBrackets = (equation, enableConstants, variables) => {
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
	let extractedEquationResult = ParseMath(extractedEquation, enableConstants, variables);

	let firstPart = equation.substring(0, firstBracketIdx);
	let lastPart = equation.substring(lastBracketIdx + 1, equation.length);

	if (isInteger(firstPart.charAt(firstPart.length - 1)) || (firstPart.charAt(firstPart.length - 1) && !letterIsPartOfFunction(firstPart, firstPart.length - 1))) {
		// character before bracket is number, so implied multiplication
		firstPart += '*';
	} else if (containsFinalString(firstPart)) {
		// operation to be done to contents of brackets
		let operation = containsFinalString(firstPart);

		firstPart = firstPart.substring(0, firstPart.length - operation.length);
		extractedEquationResult = performCalculation(extractedEquationResult, operation);

		if (isInteger(firstPart.charAt(firstPart.length - 1)) || (firstPart.charAt(firstPart.length - 1) && !letterIsPartOfFunction(firstPart, firstPart.length - 1))) {
			firstPart += '*'
		}
	};

	if (isInteger(lastPart.charAt(0)) || lastPart.charAt(0) === '(' || isLetter(lastPart.charAt(0))) {
		// character after bracket is number, letter or bracket, so implied multiplication
		lastPart = '*' + lastPart;
	}

	const fullResult = firstPart + extractedEquationResult + lastPart;

	return fullResult;
}

const containsBracket = equation => /[\(\)\[\]]/g.test(equation);

// for example, equation is 5 * 6 / 7 + 8
function ParseMath(equation, enableConstants = true, variables = null) {
	equation = equation.replace(/\s/g, '');

	// update variables
	if (!enableConstants) VARIABLES = {}
	else if (enableConstants) {
		VARIABLES = CONSTANTS;
	}

	if (variables !== null && typeof variables === 'object') {
		Object.keys(variables).forEach(variableKey => {
			let variableContent = variables[variableKey];
			if (typeof variableContent === 'string' && variableContent in VARIABLES) {
				variableContent = VARIABLES[variableContent];
			}
			VARIABLES[variableKey] = variableContent;
		});
	}

	while (containsBracket(equation)) {
		equation = removeInnerBrackets(equation, enableConstants, variables);
	}

	const equationValues = equation.split('');

	const numbers = new Stack();
	const operators = new Stack();
	const pendingNumbers = new Stack();

	let prevItem = 'operator';

	equationValues.forEach((equationValue, idx) => {
		if (equationValue != ' ') {
			if (isOperator(equationValue)) {
				if (prevItem === 'operator' && equationValue === '-') {
					// last item was operator and this is minus, so treat as start of negative number
					pendingNumbers.push(equationValue);
					prevItem = 'number';
				} else {
					// part of equation is an operator
					operators.push(equationValue);
					prevItem = 'operator';
				}
			} else if (isInteger(equationValue)) {
				// part of equation is an integer
				if (idx !== equation.length - 1 && (isInteger(equation.charAt(idx + 1)) || equation.charAt(idx + 1) === '.')) {
					// not end of equation string and next character is number or decimal point, so treat as one
					pendingNumbers.push(equationValue);
				} else if (idx !== 0 && (isInteger(equation.charAt(idx - 1)) || equation.charAt(idx - 1) === '.' || (equation.charAt(idx - 1) === '-' && prevItem === 'number'))) {
					// not start of equation string, next character is not number but previous number is number, decimal point or negative
					pendingNumbers.push(equationValue);

					let resultingNumberString = '';
					while (!pendingNumbers.isEmpty()) {
						resultingNumberString += pendingNumbers.pop(0);
					}

					numbers.push(resultingNumberString);
				} else {
					numbers.push(equationValue);
				}

				prevItem = 'number';
			} else if (equationValue === '.') {
				pendingNumbers.push('.');
			} else if (equationValue in VARIABLES && !letterIsPartOfFunction(equation, idx)) {
				// is a variable

				if (idx !== 0 && prevItem === 'number') {
					// e.g. 3e, values should be multiplied together
					operators.push('*');
				}

				equationValue = VARIABLES[equationValue].toString();
				numbers.push(equationValue);
				prevItem = 'number';
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

	const result = Number(numbers.pop());
	return result;
}

module.exports = ParseMath;