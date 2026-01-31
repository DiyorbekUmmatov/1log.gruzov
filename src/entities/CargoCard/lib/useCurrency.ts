export const getCurrency = (price: number) => {
  if (price >= 1 && price < 1000) {
    return "UZS";
  } else if (price >= 1000 && price <= 100_000) {
    return "USD";
  } else if (price > 100_000 && price <= 999_999) {
    return "RUB";
  } else if (price > 1_000_000) {
    return "UZS";
  } else {
    return "";
  }
};
