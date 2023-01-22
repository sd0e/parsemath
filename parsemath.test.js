const ParseMath = require('./parsemath');

test('simple addition', () => {
	expect(ParseMath('5 + 3')).toBe(8);
});

test('negative addition', () => {
	expect(ParseMath('-843 + -2.43')).toBe(-845.43);
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