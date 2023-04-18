export function addMonths(input, numMonths) {
    // Convert input string to a Date object
    const [year, month] = input.split('-');
    const date = new Date(year, month - 1);
  
    // Add or subtract the desired number of months
    date.setMonth(date.getMonth() + numMonths);
  
    // Format the resulting date back to a "YYYY-MM" string
    const newYear = date.getFullYear();
    const newMonth = String(date.getMonth() + 1).padStart(2, '0');
  
    return `${newYear}-${newMonth}`;
  }