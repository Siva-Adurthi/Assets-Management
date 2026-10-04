export const makeId = (prefix, number) =>
  `${prefix}${String(number).padStart(3, "0")}`;
