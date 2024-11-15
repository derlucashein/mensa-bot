const twentyFourHours = 86400000;

export function runAtSpecificTimeOfDay(
  hour: number,
  minutes: number,
  fun: () => void,
  updateInterval: (interval: NodeJS.Timeout) => void
): NodeJS.Timeout {
  console.log(hour);
  console.log(minutes);
  return setTimeout(() => {
    //first execution
    fun();

    //executions after
    updateInterval(setInterval(fun, twentyFourHours));
  }, calcRemainingTimeForFirstExecution(new Date(), hour, minutes));
}

function calcRemainingTimeForFirstExecution(
  currentTime: Date,
  hour: number,
  minutes: number
): number {
  let remainingTime =
    new Date(
      currentTime.getFullYear(),
      currentTime.getMonth(),
      currentTime.getDate(),
      hour,
      minutes,
      0,
      0
    ).getTime() - currentTime.getTime();

  if (remainingTime < 0) remainingTime += twentyFourHours;

  console.log(remainingTime);

  return remainingTime;
}
