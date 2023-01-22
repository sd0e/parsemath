const ParseMath = require('./parsemath');

test('simple addition', () => {
	expect(ParseMath('5 + 3')).toBe(8);
});

test('negative addition', () => {
	expect(ParseMath('-843 + -2.43')).toBe(-845.43);
});

test('numbers with multiple decimal places', () => {
	expect(ParseMath('1.234 + 5.678')).toBe(6.912);
});

test('simple equation with multiple operators', () => {
	expect(ParseMath('5 + 3 * 6 / 2')).toBe(14);
});

test('multiply then square then multiply', () => {
	expect(ParseMath('5 * 5 ^ 2 * 5')).toBe(625);
});

test('polynomial with no brackets', () => {
	expect(ParseMath('3*6^2 - 5*6 + 3')).toBe(81);
});

test('polynomial with brackets', () => {
	expect(ParseMath('3(6)^2 - 5(6) + 3')).toBe(81);
});

test('polynomial with different brackets', () => {
	expect(ParseMath('3[6]^2 - 5(6) + 3')).toBe(81);
});

test('polynomial with variable', () => {
	expect(ParseMath('3x^2 - 5x + 3', true, {"x": 6})).toBe(81);
});

test('polynomial with variable in Greek alphabet', () => {
	expect(ParseMath('3δ^2 - 5δ + 3', true, {"δ": 6})).toBe(81);
});

test('polynomial with both uppercase and lowercase variables', () => {
	expect(ParseMath('3x^2 - 5X + 3', true, {"x": 6, "X": 4})).toBe(91);
});

test('polynomial with both uppercase and lowercase variables in Greek alphabet', () => {
	expect(ParseMath('3δ^2 - 5Δ + 3', true, {"δ": 6, "Δ": 4})).toBe(91);
});

test('polynomial with decimal variable', () => {
	expect(Number(ParseMath('3x^2 - 5x + 3', true, {"x": 6.2}).toFixed(2))).toBe(87.32);
});

test('polynomial with negative variable', () => {
	expect(ParseMath('3x^2 - 5x + 3', true, {"x": -6})).toBe(141);
});

test('polynomial with negative decimal variable', () => {
	expect(Number(ParseMath('3x^2 - 5x + 3', true, {"x": -6.2}).toFixed(2))).toBe(149.32);
});

test('very large power with brackets', () => {
	expect(ParseMath('3.2^(9 * (8 + 3))')).toBe(1.02293456496755e+50);
});

test('multiple square roots in brackets', () => {
	expect(Number(ParseMath('5 + sqrt(sqrt(5 * 6))').toFixed(3))).toBe(7.340);
});

test('simple equation with trigonometry', () => {
	expect(Number(ParseMath('sin(2) + 1').toFixed(3))).toBe(1.909);
});

test('single cos trigonometric function', () => {
	expect(Number(ParseMath('cos(2)').toFixed(3))).toBe(-0.416);
});

test('single cos trigonometric function with incorrect capitalization', () => {
	expect(Number(ParseMath('Cos(2)').toFixed(3))).toBe(-0.416);
});

test('simple equation with negative trigonometry', () => {
	expect(Number(ParseMath('sin(-2) + 1').toFixed(3))).toBe(0.091);
});

test('equation with multiple trigonometric equations', () => {
	expect(Number(ParseMath('5*1-(sin(2)*tan(2))').toFixed(3))).toBe(6.987);
});

test('two trigonometric functions with implied multiplication', () => {
	expect(Number(ParseMath('sin(0.5)cos(0.5)').toFixed(3))).toBe(0.421);
});

test('implied multiplication before trigonometric equation', () => {
	expect(Number(ParseMath('3cos(0.5)').toFixed(3))).toBe(2.633);
});

test('two trigonometric functions with implied multiplication both before and after', () => {
	expect(Number(ParseMath('3sin(0.5)cos(0.5)').toFixed(3))).toBe(1.262);
});

test('multiple sequential brackets', () => {
	expect(Number(ParseMath('5 + (9)(8)'))).toBe(77);
});

test('several sequential brackets', () => {
	expect(Number(ParseMath('5 + (9)(8)(7)(6)'))).toBe(3029);
});

test('multiple sequential brackets with negative before', () => {
	expect(Number(ParseMath('5 + -(9)(8)'))).toBe(-67);
});

test('multiple sequential brackets with square on final', () => {
	expect(Number(ParseMath('5 + (9)(8)^2'))).toBe(581);
});

test('asin, acos and atan', () => {
	expect(Number(ParseMath('asin(0.2) + acos(0.4) + atan(0.6)').toFixed(3))).toBe(1.901);
});

test('negative function', () => {
	expect(Number(ParseMath('-asin(0.2)').toFixed(3))).toBe(-0.201);
});

test('arcsin, arccos and arctan', () => {
	expect(Number(ParseMath('arcsin(0.2) + arccos(0.4) + arctan(0.6)').toFixed(3))).toBe(1.901);
});

test('single variable by itself in equation', () => {
	expect(Number(ParseMath('e * 3').toFixed(3))).toBe(8.155);
});

test('single variable by itself in equation with implied multiplication', () => {
	expect(Number(ParseMath('3e').toFixed(3))).toBe(8.155);
});

test('custom variables', () => {
	expect(Number(ParseMath('3 * (x / 2)', false, {"x": 4}))).toBe(6);
});

test('raise to power of a negative', () => {
	expect(Number(ParseMath('4^-2'))).toBe(0.0625);
});

test('raise to power of brackets', () => {
	expect(Number(ParseMath('4^(e + 3)').toFixed(3))).toBe(2771.716);
});

test('two variables in single bracket', () => {
	expect(Number(ParseMath('4^(e + e)').toFixed(3))).toBe(1875.588);
});

test('multiplying variable by function', () => {
	expect(Number(ParseMath('e * sin(0.2)').toFixed(3))).toBe(0.540);
});

test('multiple sequential variables', () => {
	expect(ParseMath('px^2 + qx - r', false, {"p": 3, "x": 2, "q": 1, "r": -5})).toBe(19);
});

test('multiple sequential variables and constants', () => {
	expect(Number(ParseMath('px^2 + qx - re', true, {"p": 3, "x": 2, "q": 1, "r": -5}).toFixed(3))).toBe(27.591);
});

test('treating constant as function', () => {
	expect(Number(ParseMath('e(3)', true).toFixed(3))).toBe(8.155);
});

test('simple multiplication with pi', () => {
	expect(Number(ParseMath('π * 3', true).toFixed(3))).toBe(9.425);
});

test('bracket implied multiplication with pi', () => {
	expect(Number(ParseMath('π(3)', true).toFixed(3))).toBe(9.425);
});

test('using constant as a variable value', () => {
	expect(Number(ParseMath('3x', true, {"x": "π"}).toFixed(3))).toBe(9.425);
});

test('multiple sequential variables with implied multiplication', () => {
	expect(Number(ParseMath('8eπ(3^2)').toFixed(3))).toBe(614.861);
});
