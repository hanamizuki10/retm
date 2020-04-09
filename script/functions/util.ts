export const getDayFormat = (date = new Date()): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month}-${day}`;
};
export const toDate = (str: string, separator: string): Date => {
  var arr = str.split(separator);
  var realDigits = arr.map(Number)
  return new Date(realDigits[0], realDigits[1] - 1, realDigits[2]);
};