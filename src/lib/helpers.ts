import { isNumber, isNaN, isFinite } from "lodash";

export function toSafeNumber(number: number, dp = 2) {
  if (!isValidNumber(number)) return 0;

  return parseFloat(number.toFixed(dp));
}

export function numberToDisplayString(number: number, dp = 2) {
  if (!isValidNumber(number)) return "-";

  const formatted = number.toLocaleString(undefined, {
    minimumFractionDigits: dp,
    maximumFractionDigits: dp
  });

  // Remove trailing 0s
  return formatted.replace(/\.0+$/, "");
}

export function isValidNumber(value: number): boolean {
  return isNumber(value) && !isNaN(value) && isFinite(value);
}

export function getPercent(num: number, denom: number) {
  if (!isValidNumber(denom) || denom === 0) return "- %";

  return `${((num / denom) * 100).toFixed(2)} %`;
}
