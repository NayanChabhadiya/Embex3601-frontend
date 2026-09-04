export const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear());
  return `${day}-${month}-${year}`;
};

export const formatDateForInput = (date) => {
  if (!date) return "";

  const d = new Date(date);
  if (isNaN(d.getTime())) return ""; // check for invalid date

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const getDueDate = (billDate, daysToAdd) => {
  const date = new Date(billDate);
  date.setDate(date.getDate() + daysToAdd);
  return formatDateForInput(date);
};

export const formatRupees = (amount) => {
  if (isNaN(amount)) return "₹ 0/-";
  return `₹ ${Number(amount).toLocaleString("en-IN")}/-`;
};

export const convertToWords = (num) => {
  const a = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];

  const b = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  const numberToWords = (n) => {
    n = parseInt(n);
    if (n === 0) return "Zero";

    const getWords = (n) => {
      let str = "";

      if (n >= 10000000) {
        str += getWords(Math.floor(n / 10000000)) + " Crore ";
        n %= 10000000;
      }
      if (n >= 100000) {
        str += getWords(Math.floor(n / 100000)) + " Lakh ";
        n %= 100000;
      }
      if (n >= 1000) {
        str += getWords(Math.floor(n / 1000)) + " Thousand ";
        n %= 1000;
      }
      if (n >= 100) {
        str += getWords(Math.floor(n / 100)) + " Hundred ";
        n %= 100;
      }
      if (n > 0) {
        if (n < 20) str += a[n] + " ";
        else {
          str += b[Math.floor(n / 10)] + " ";
          if (n % 10 > 0) str += a[n % 10] + " ";
        }
      }
      return str;
    };

    return getWords(n).trim();
  };

  // ✅ FIX START
  if (num === null || num === undefined || isNaN(num)) {
    return "Zero Rupees Only";
  }

  const parsedNum = parseFloat(num);

  if (parsedNum === 0) {
    return "Zero Rupees Only";
  }
  // ✅ FIX END

  const [rupees, paise] = parsedNum.toFixed(2).split(".");

  let words = numberToWords(rupees) + " Rupees";

  if (parseInt(paise) > 0) {
    words += " and " + numberToWords(paise) + " Paise";
  }

  return words + " Only";
};
