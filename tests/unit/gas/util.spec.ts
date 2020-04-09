import { getDayFormat, toDate } from '../../../script/functions/util';

describe('util', () => {
  describe('getDayFormat()', () => {
    it('no parameter', () => {
      const now = new Date();
      const expected = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
      expect(getDayFormat()).toBe(expected);
    });
    it('with date parameter', () => {
      const date = new Date(2018, 2, 9);
      expect(getDayFormat(date)).toBe('2018-3-9');
    });
  });
  describe('toDate()', () => {
    const expected = new Date(2020, 2, 4);
    console.log(expected);
    expect(toDate('2020-03-04', '-')).toStrictEqual(expected);
  });
});
