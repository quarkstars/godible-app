export function nextSendTime(sendHour: number) {
  const date = new Date();
  const nextDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);

  nextDate.setHours(sendHour, 0, 0, 0);

  if (nextDate.getTime() <= date.getTime()) {
    nextDate.setDate(nextDate.getDate() + 1);
  }

  return nextDate.getTime();
}