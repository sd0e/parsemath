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

test('polynomial with no brackets', () => {
	expect(ParseMath('3*6^2 - 5*6 + 3')).toBe(81);
});

test('polynomial with brackets', () => {
	expect(ParseMath('3(6)^2 - 5(6) + 3')).toBe(81);
});

test('polynomial with different brackets', () => {
	expect(ParseMath('3[6]^2 - 5(6) + 3')).toBe(81);
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

test('simple equation with negative trigonometry', () => {
	expect(Number(ParseMath('sin(-2) + 1').toFixed(3))).toBe(0.091);
});

test('equation with multiple trigonometric equations', () => {
	expect(Number(ParseMath('5*1-(sin(2)*tan(2))').toFixed(3))).toBe(6.987);
});

test('multiple sequential brackets', () => {
	expect(Number(ParseMath('5 + (9)(8)'))).toBe(77);
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

test('custom variables', () => {
	expect(Number(ParseMath('3 * (x / 2)', false, {"x": 4}))).toBe(6);
});

test('raise to power of a negative', () => {
	expect(Number(ParseMath('4^-2'))).toBe(0.0625);
});
