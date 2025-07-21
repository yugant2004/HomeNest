// /**
//  * Formats a price value according to Indian currency conventions (rupees, lakhs, crores)
//  * @param {number} price - The price value to format
//  * @returns {string} - Formatted price string
//  */
// export const formatIndianPrice = (price) => {
//   if (typeof price !== 'number') return "Price unknown";
  
//   // Helper function to format numbers with Indian numbering system (commas)
//   const formatNumberWithCommas = (num) => {
//     // Convert to string and split by decimal point
//     const parts = num.toString().split('.');
//     const integerPart = parts[0];
//     const decimalPart = parts.length > 1 ? '.' + parts[1] : '';
    
//     // Format integer part with commas (Indian system: 1,00,000 instead of 100,000)
//     let formattedInteger = '';
//     let count = 0;
    
//     // Process from right to left
//     for (let i = integerPart.length - 1; i >= 0; i--) {
//       count++;
//       formattedInteger = integerPart[i] + formattedInteger;
      
//       // Add comma after first 3 digits, then after every 2 digits
//       if (count === 3 && i !== 0) {
//         formattedInteger = ',' + formattedInteger;
//         count = 0;
//       } else if (count === 2 && i !== 0 && formattedInteger.includes(',')) {
//         formattedInteger = ',' + formattedInteger;
//         count = 0;
//       }
//     }
    
//     return formattedInteger + decimalPart;
//   };
  
//   // Format based on value range
//   if (price < 1) {
//     // Convert to rupees (assuming price is in lakhs)
//     const rupees = price * 100000;
//     return `₹${formatNumberWithCommas(rupees)}`;
//   } else if (price >= 1 && price < 100) {
//     // Format in lakhs
//     const suffix = price === 1 ? 'Lakh' : 'Lakhs';
//     // Keep one decimal place if it's not a whole number
//     const formattedPrice = Number.isInteger(price) ? price : price.toFixed(1);
//     return `₹${formattedPrice} ${suffix}`;
//   } else {
//     // Format in crores
//     const crores = price / 100;
//     const suffix = crores === 1 ? 'Crore' : 'Crores';
//     // Keep one decimal place if it's not a whole number
//     const formattedCrores = Number.isInteger(crores) ? crores : crores.toFixed(1);
//     return `₹${formattedCrores} ${suffix}`;
//   }
// };

/**
//  * Formats a price value into Indian currency format (Rupees, Lakhs, Crores).
//  * Assumes input is in lakhs (e.g., 75 means ₹75 Lakhs, 120 means ₹1.2 Crores).
//  * @param {number} price
//  * @returns {string}
//  */
// export const formatIndianPrice = (price) => {
//   if (typeof price !== 'number' || isNaN(price)) return "Price unknown";

//   if (price < 1) {
//     // Less than 1 lakh: convert to rupees
//     const rupees = price * 100000;
//     return `₹${new Intl.NumberFormat("en-IN").format(rupees)}`;
//   } else if (price >= 1 && price < 100) {
//     // 1 to 99.99 lakhs
//     const formatted = price % 1 === 0 ? price : price.toFixed(1);
//     return `₹${formatted} Lakh${price >= 2 ? "s" : ""}`;
//   } else {
//     // 1 crore and above
//     const crores = price / 100;
//     const formatted = crores % 1 === 0 ? crores : crores.toFixed(1);
//     return `₹${formatted} Crore${crores >= 2 ? "s" : ""}`;
//   }
// };
export const formatIndianPrice = (price) => {
  if (typeof price !== 'number' || isNaN(price)) return "Price unknown";

  if (price < 100000) {
    return `₹${price.toLocaleString('en-IN')}`;
  } else if (price >= 100000 && price < 10000000) {
    const lakhs = price / 100000;
    const formatted = Number.isInteger(lakhs) ? lakhs : lakhs.toFixed(1);
    return `₹${formatted} Lakh${lakhs > 1 ? 's' : ''}`;
  } else {
    const crores = price / 10000000;
    const formatted = Number.isInteger(crores) ? crores : crores.toFixed(1);
    return `₹${formatted} Crore${crores > 1 ? 's' : ''}`;
  }
};
