# parsemath

[![View coverage report image](https://img.shields.io/badge/view%20coverage%20report-click-informational)](https://git.sebdoe.com/parsemath/coverage/lcov-report/)

> Disclaimer: I am not an expert in number parsing and this library has not been extensively tested, so do not use this library if reliability is important. **I do not hold any liability if this code does not work as expected.**

A JavaScript library which parses an equation in string format to a number.

## Current abilities
* Evaluate mathematical expressions with the following operators: `^`, `*`, `/`, `+`, `-`
* Evaluate mathematical expressions with the following operators containing a number inside the brackets, with **trigonometric values represented in radians**: `sqrt()`, `sin()`, `cos()`, `tan()`
* Evaluate mathematical expressions with brackets
* Evaluate mathematical expressions containing multi-digit positive and negative integers and floats
* Evaluate mathematical expressions involving the mathematical constants `e` and `π` (the `enableConstants` parameter must be set to true for this to work)
* Evaluate mathematical expressions involving variables in the Roman and Greek alphabets

## Certain things that are known to not work
(This is not an exhaustive list)
* Placing a number or variable immediately before a function (e.g. `8cos(0.5)`)
* Modulus brackets (`|`)

## Usage
The function accepts the following arguments in their respective order:
* **equation** (*string*): the equation to be parsed
* **enableConstants** (*boolean*, default is `true`): whether to enable the mathematical constants `e` and `π` when parsing equation
* **variables** (*object*, default is `null`): any custom variables to be used when parsing equation

#### Example `variables` object
```js
{
    "x": 0,
    "y": -4.3
}
```

## Examples
#### Simple Equation
```js
ParseMath('5 + 3 * 6 / 2') // 14
```

#### Equation with Constants
```js
Number(ParseMath('3e').toFixed(3)) // 8.155
```

#### Equation with Custom Variables
```js
ParseMath('3x^2 - 5x + 3', true, {"x": 6}) // 81
```

#### Equation with Trigonometric Function

```js
Number(ParseMath('5*1-(sin(2)*tan(2))').toFixed(3)) // 6.987
```

Note that this library has the standard JavaScript floating point math issue where there are occasionally inaccurate results, such as `0.1 + 0.2 = 0.30000000000000004`. This can be resolved by the user by rounding the answer to an appropriate number of decimal places.

Again, this library has not been fully tested so may not work as expected with these abilities.
