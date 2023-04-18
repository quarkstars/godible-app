export function formatDate(input: string) {
    // Create a Date object from the input string
    const date = new Date(input);
    const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);


    // Create arrays for day and month names
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
    // Get the day, month, and year from the date object
    const day = days[localDate.getDay()];
    const month = months[localDate.getMonth()];
    const year = localDate.getFullYear();
  
    // Format the date string
    const formattedDate = `${day}, ${month} ${localDate.getDate()}, ${year}`;
  
    // return formattedDate;
    return formattedDate
  }