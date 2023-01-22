# parsemath

> Disclaimer: I am not an expert in number parsing and this library has not been extensively tested, so do not use this library if reliability is important. **I do not hold any liability if this code does not work as expected.**

A JavaScript library which parses an equation in string format to a number.

Current abilities:
* Evaluate mathematical expressions with the following operators: `^`, `*`, `/`, `+`, `-`
* Evaluate mathematical expressions with the following operators containing a number inside the brackets, with **trigonometric values represented in radians**: `sqrt()`, `sin()`, `cos()`, `tan()`
* Evaluate mathematical expressions with brackets
* Evaluate mathematical expressions containing multi-digit positive and negative integers and floats
* Evaluate mathematical expressions involving the mathematical constants `e` and `π` (the `enableConstants` parameter must be set to true for this to work)
* Evaluate mathematical expressions involving variables in the Roman and Greek alphabets.

Note that this library has the standard JavaScript floating point math issue where there are occasionally inaccurate results, such as `0.1 + 0.2 = 0.30000000000000004`. This can be resolved by the user by rounding the answer to an appropriate number of decimal places.

Again, this library has not been fully tested so may not work as expected with these abilities.
